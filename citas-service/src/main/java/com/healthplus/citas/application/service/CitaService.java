package com.healthplus.citas.application.service;

import com.healthplus.citas.domain.event.CitaCreadaEvent;
import com.healthplus.citas.domain.model.Cita;
import com.healthplus.citas.domain.repository.CitaRepository;
import com.healthplus.citas.infrastructure.exception.CitaConflictException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.kafka.core.reactive.ReactiveKafkaProducerTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class CitaService {

    private static final Logger log = LoggerFactory.getLogger(CitaService.class);

    private final CitaRepository citaRepository;
    private final ReactiveStringRedisTemplate redisTemplate;
    private final ReactiveKafkaProducerTemplate<String, Object> kafkaProducerTemplate;

    @Value("${spring.kafka.topics.cita-creada}")
    private String topicCitaCreada;

    private static final Duration LOCK_TTL = Duration.ofMinutes(5);

    public CitaService(CitaRepository citaRepository,
                       ReactiveStringRedisTemplate redisTemplate,
                       ReactiveKafkaProducerTemplate<String, Object> kafkaProducerTemplate) {
        this.citaRepository = citaRepository;
        this.redisTemplate = redisTemplate;
        this.kafkaProducerTemplate = kafkaProducerTemplate;
    }

    /**
     * Orquestación reactiva y no bloqueante para agendar citas:
     * 1. Adquiere candado distribuido atómico en Redis (SETNX + TTL 5m) para evitar sobre-reserva.
     * 2. Si el slot está libre, persiste la cita en PostgreSQL mediante R2DBC.
     * 3. Emite asíncronamente el evento de dominio a Kafka sin bloquear el hilo reactivo.
     * 4. En caso de error durante persistencia o emisión, libera preventivamente el candado de Redis.
     */
    public Mono<Cita> agendarCita(Cita cita) {
        String lockKey = String.format("lock:medico:%s:%s", cita.getMedicoId(), cita.getFechaHora());
        String lockValue = UUID.randomUUID().toString();

        return redisTemplate.opsForValue()
                // 1. Bloqueo Distribuido Atómico en Redis
                .setIfAbsent(lockKey, lockValue, LOCK_TTL)
                .flatMap(acquired -> {
                    if (Boolean.FALSE.equals(acquired)) {
                        log.warn("Conflicto de concurrencia: el médico {} ya cuenta con un bloqueo activo en {}",
                                cita.getMedicoId(), cita.getFechaHora());
                        return Mono.error(new CitaConflictException(
                                "El médico seleccionado no tiene disponibilidad para el horario solicitado."));
                    }

                    // 2. Persistencia Reactiva con Spring Data R2DBC
                    cita.setEstado("CONFIRMADA");
                    Instant now = Instant.now();
                    if (cita.getCreatedAt() == null) {
                        cita.setCreatedAt(now);
                    }
                    cita.setUpdatedAt(now);

                    return citaRepository.save(cita)
                            // 3. Notificación Asíncrona con ReactiveKafkaProducerTemplate
                            .flatMap(citaGuardada -> {
                                CitaCreadaEvent evento = CitaCreadaEvent.fromCita(citaGuardada, null);
                                return kafkaProducerTemplate.send(topicCitaCreada, citaGuardada.getId().toString(), evento)
                                        .doOnSuccess(senderResult -> log.info("Evento Kafka {} publicado con éxito para cita {}",
                                                topicCitaCreada, citaGuardada.getId()))
                                        .thenReturn(citaGuardada);
                            })
                            // Contingencia reactiva: si falla el guardado o Kafka, liberamos el lock
                            .onErrorResume(ex -> {
                                log.error("Fallo durante el agendamiento de cita. Liberando candado Redis: {}", lockKey, ex);
                                return redisTemplate.delete(lockKey)
                                        .then(Mono.error(ex));
                            });
                });
    }
}

package com.healthplus.citas.domain.repository;

import com.healthplus.citas.domain.model.Cita;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@Repository
public interface CitaRepository extends ReactiveCrudRepository<Cita, UUID> {

    Flux<Cita> findByPacienteIdOrderByFechaHoraDesc(UUID pacienteId);

    Flux<Cita> findByMedicoIdAndFechaHoraBetween(UUID medicoId, Instant inicio, Instant fin);

    Mono<Boolean> existsByMedicoIdAndFechaHoraAndEstadoIn(UUID medicoId, Instant fechaHora, Collection<String> estados);

    Mono<Long> countByFechaHoraBetween(Instant inicio, Instant fin);

    Flux<Cita> findAllByOrderByFechaHoraDesc();
}

package com.healthplus.citas.application.service;

import com.healthplus.citas.application.dto.RecetaRequest;
import com.healthplus.citas.domain.model.Receta;
import com.healthplus.citas.domain.repository.RecetaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RecetaService {

    private static final Logger log = LoggerFactory.getLogger(RecetaService.class);

    private final RecetaRepository recetaRepository;

    public RecetaService(RecetaRepository recetaRepository) {
        this.recetaRepository = recetaRepository;
    }

    public Flux<Receta> listarRecetas() {
        return recetaRepository.findAllByOrderByCreatedAtDesc();
    }

    public Flux<Receta> listarPorPaciente(UUID pacienteId) {
        return recetaRepository.findByPacienteIdOrderByCreatedAtDesc(pacienteId);
    }

    public Mono<Receta> obtenerPorId(UUID id) {
        return recetaRepository.findById(id);
    }

    public Mono<Receta> crearReceta(RecetaRequest request) {
        Instant now = Instant.now();
        String firma = request.getFirmaDigital();
        if (firma == null || firma.isBlank()) {
            firma = generarFirmaDigital(request.getPacienteId(), request.getMedicoId(), now);
        }

        Receta receta = Receta.builder()
                .citaId(request.getCitaId())
                .pacienteId(request.getPacienteId())
                .medicoId(request.getMedicoId())
                .medicamentos(request.getMedicamentos())
                .indicacionesGenerales(request.getIndicacionesGenerales())
                .firmaDigital(firma)
                .fechaEmision(now)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return recetaRepository.save(receta)
                .doOnSuccess(r -> log.info("Receta médica emitida con éxito: {}", r.getId()));
    }

    private String generarFirmaDigital(UUID pacienteId, UUID medicoId, Instant timestamp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            String raw = pacienteId + ":" + medicoId + ":" + timestamp.toEpochMilli();
            byte[] hash = digest.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}

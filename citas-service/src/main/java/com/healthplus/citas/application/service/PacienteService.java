package com.healthplus.citas.application.service;

import com.healthplus.citas.application.dto.PacienteRequest;
import com.healthplus.citas.domain.model.Paciente;
import com.healthplus.citas.domain.repository.PacienteRepository;
import com.healthplus.citas.infrastructure.exception.CitaConflictException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Service
public class PacienteService {

    private static final Logger log = LoggerFactory.getLogger(PacienteService.class);

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    public Flux<Paciente> listarPacientes() {
        return pacienteRepository.findAllByOrderByCreatedAtDesc();
    }

    public Mono<Paciente> obtenerPorId(UUID id) {
        return pacienteRepository.findById(id);
    }

    public Mono<Paciente> crearPaciente(PacienteRequest request) {
        return pacienteRepository.existsByDocumento(request.getDocumento())
                .flatMap(existeDoc -> {
                    if (Boolean.TRUE.equals(existeDoc)) {
                        return Mono.error(new CitaConflictException("Ya existe un paciente registrado con el documento: " + request.getDocumento()));
                    }
                    return pacienteRepository.existsByCorreo(request.getCorreo())
                            .flatMap(existeCorreo -> {
                                if (Boolean.TRUE.equals(existeCorreo)) {
                                    return Mono.error(new CitaConflictException("Ya existe un paciente registrado con el correo: " + request.getCorreo()));
                                }
                                Instant now = Instant.now();
                                Paciente paciente = Paciente.builder()
                                        .documento(request.getDocumento().trim())
                                        .nombre(request.getNombre().trim())
                                        .correo(request.getCorreo().trim().toLowerCase())
                                        .telefono(request.getTelefono().trim())
                                        .createdAt(now)
                                        .updatedAt(now)
                                        .build();
                                return pacienteRepository.save(paciente);
                            });
                })
                .doOnSuccess(p -> log.info("Paciente registrado con éxito: {} - {}", p.getId(), p.getNombre()));
    }
}

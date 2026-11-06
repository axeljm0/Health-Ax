package com.healthplus.citas.application.service;

import com.healthplus.citas.application.dto.MedicoRequest;
import com.healthplus.citas.domain.model.Medico;
import com.healthplus.citas.domain.repository.MedicoRepository;
import com.healthplus.citas.infrastructure.exception.CitaConflictException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.UUID;

@Service
public class MedicoService {

    private static final Logger log = LoggerFactory.getLogger(MedicoService.class);

    private final MedicoRepository medicoRepository;

    public MedicoService(MedicoRepository medicoRepository) {
        this.medicoRepository = medicoRepository;
    }

    public Flux<Medico> listarMedicos() {
        return medicoRepository.findAllByOrderByNombreAsc();
    }

    public Flux<Medico> listarMedicosActivos() {
        return medicoRepository.findByActivoTrue();
    }

    public Mono<Medico> obtenerPorId(UUID id) {
        return medicoRepository.findById(id);
    }

    public Mono<Medico> crearMedico(MedicoRequest request) {
        return medicoRepository.existsByLicenciaMedica(request.getLicenciaMedica())
                .flatMap(existe -> {
                    if (Boolean.TRUE.equals(existe)) {
                        return Mono.error(new CitaConflictException(
                                "Ya existe un médico registrado con la licencia: " + request.getLicenciaMedica()));
                    }
                    Instant now = Instant.now();
                    Medico medico = Medico.builder()
                            .nombre(request.getNombre().trim())
                            .especialidad(request.getEspecialidad().trim())
                            .licenciaMedica(request.getLicenciaMedica().trim().toUpperCase())
                            .activo(true)
                            .createdAt(now)
                            .updatedAt(now)
                            .build();
                    return medicoRepository.save(medico);
                })
                .doOnSuccess(m -> log.info("Médico registrado con éxito: {} - {}", m.getId(), m.getNombre()));
    }
}

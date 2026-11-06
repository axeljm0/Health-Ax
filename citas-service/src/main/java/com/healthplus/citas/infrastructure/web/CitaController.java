package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.CitaRequest;
import com.healthplus.citas.application.service.CitaService;
import com.healthplus.citas.domain.model.Cita;
import com.healthplus.citas.domain.repository.CitaRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/citas")
public class CitaController {

    private static final Logger log = LoggerFactory.getLogger(CitaController.class);

    private final CitaService citaService;
    private final CitaRepository citaRepository;

    public CitaController(CitaService citaService, CitaRepository citaRepository) {
        this.citaService = citaService;
        this.citaRepository = citaRepository;
    }

    /**
     * Endpoint reactivo para agendar citas médicas con protección de concurrencia distribuida.
     * Devuelve HTTP 201 Created si la operación es exitosa,
     * o HTTP 409 Conflict si el médico ya tiene ese slot horario reservado.
     */
    @PostMapping
    public Mono<ResponseEntity<Cita>> agendarCita(@Valid @RequestBody CitaRequest request) {
        log.info("Recibida solicitud reactiva para agendar cita. Medico: {}, FechaHora: {}",
                request.getMedicoId(), request.getFechaHora());

        Cita cita = Cita.builder()
                .pacienteId(request.getPacienteId())
                .medicoId(request.getMedicoId())
                .fechaHora(request.getFechaHora())
                .motivoConsulta(request.getMotivoConsulta())
                .build();

        return citaService.agendarCita(cita)
                .map(citaCreada -> ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(citaCreada)
                );
    }

    /**
     * Consulta reactiva de todas las citas del sistema
     */
    @GetMapping
    public Flux<Cita> listarTodas() {
        return citaRepository.findAllByOrderByFechaHoraDesc();
    }

    /**
     * Consulta reactiva del historial de citas de un paciente
     */
    @GetMapping("/paciente/{pacienteId}")
    public Flux<Cita> listarPorPaciente(@PathVariable UUID pacienteId) {
        return citaRepository.findByPacienteIdOrderByFechaHoraDesc(pacienteId);
    }

    /**
     * Consulta de cita individual por identificador UUID
     */
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Cita>> obtenerCita(@PathVariable UUID id) {
        return citaRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}

package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.PacienteRequest;
import com.healthplus.citas.application.service.PacienteService;
import com.healthplus.citas.domain.model.Paciente;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public Flux<Paciente> listarPacientes() {
        return pacienteService.listarPacientes();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Paciente>> obtenerPaciente(@PathVariable UUID id) {
        return pacienteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<Paciente>> registrarPaciente(@Valid @RequestBody PacienteRequest request) {
        return pacienteService.crearPaciente(request)
                .map(paciente -> ResponseEntity.status(HttpStatus.CREATED).body(paciente));
    }
}

package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.MedicoRequest;
import com.healthplus.citas.application.service.MedicoService;
import com.healthplus.citas.domain.model.Medico;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @GetMapping
    public Flux<Medico> listarMedicos(@RequestParam(required = false, defaultValue = "false") boolean soloActivos) {
        return soloActivos ? medicoService.listarMedicosActivos() : medicoService.listarMedicos();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Medico>> obtenerMedico(@PathVariable UUID id) {
        return medicoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<Medico>> registrarMedico(@Valid @RequestBody MedicoRequest request) {
        return medicoService.crearMedico(request)
                .map(medico -> ResponseEntity.status(HttpStatus.CREATED).body(medico));
    }
}

package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.RecetaRequest;
import com.healthplus.citas.application.service.RecetaService;
import com.healthplus.citas.domain.model.Receta;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recetas")
public class RecetaController {

    private final RecetaService recetaService;

    public RecetaController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    @GetMapping
    public Flux<Receta> listarRecetas() {
        return recetaService.listarRecetas();
    }

    @GetMapping("/paciente/{pacienteId}")
    public Flux<Receta> listarPorPaciente(@PathVariable UUID pacienteId) {
        return recetaService.listarPorPaciente(pacienteId);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Receta>> obtenerReceta(@PathVariable UUID id) {
        return recetaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<Receta>> emitirReceta(@Valid @RequestBody RecetaRequest request) {
        return recetaService.crearReceta(request)
                .map(receta -> ResponseEntity.status(HttpStatus.CREATED).body(receta));
    }
}

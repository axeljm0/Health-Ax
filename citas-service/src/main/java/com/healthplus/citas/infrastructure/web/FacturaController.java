package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.FacturaRequest;
import com.healthplus.citas.application.service.FacturaService;
import com.healthplus.citas.domain.model.Factura;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/facturas")
public class FacturaController {

    private final FacturaService facturaService;

    public FacturaController(FacturaService facturaService) {
        this.facturaService = facturaService;
    }

    @GetMapping
    public Flux<Factura> listarFacturas() {
        return facturaService.listarFacturas();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Factura>> obtenerFactura(@PathVariable UUID id) {
        return facturaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Mono<ResponseEntity<Factura>> emitirFactura(@Valid @RequestBody FacturaRequest request) {
        return facturaService.crearFactura(request)
                .map(factura -> ResponseEntity.status(HttpStatus.CREATED).body(factura));
    }
}

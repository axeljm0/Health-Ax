package com.healthplus.citas.application.service;

import com.healthplus.citas.application.dto.FacturaRequest;
import com.healthplus.citas.domain.model.Factura;
import com.healthplus.citas.domain.repository.FacturaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class FacturaService {

    private static final Logger log = LoggerFactory.getLogger(FacturaService.class);

    private final FacturaRepository facturaRepository;

    public FacturaService(FacturaRepository facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    public Flux<Factura> listarFacturas() {
        return facturaRepository.findAllByOrderByCreatedAtDesc();
    }

    public Mono<Factura> obtenerPorId(UUID id) {
        return facturaRepository.findById(id);
    }

    public Mono<Factura> crearFactura(FacturaRequest request) {
        BigDecimal subtotal = request.getMontoSubtotal().setScale(2, RoundingMode.HALF_UP);
        BigDecimal impuesto = request.getMontoImpuesto() != null
                ? request.getMontoImpuesto().setScale(2, RoundingMode.HALF_UP)
                : subtotal.multiply(new BigDecimal("0.16")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = request.getMontoTotal() != null
                ? request.getMontoTotal().setScale(2, RoundingMode.HALF_UP)
                : subtotal.add(impuesto);

        String metodoPago = request.getMetodoPago() != null && !request.getMetodoPago().isBlank()
                ? request.getMetodoPago().toUpperCase()
                : "EFECTIVO";

        int randomSuffix = ThreadLocalRandom.current().nextInt(10000, 99999);
        String numeroFactura = String.format("FAC-%d-%05d", LocalDate.now().getYear(), randomSuffix);

        Factura factura = Factura.builder()
                .numeroFactura(numeroFactura)
                .citaId(request.getCitaId())
                .pacienteId(request.getPacienteId())
                .medicoId(request.getMedicoId())
                .concepto(request.getConcepto().trim())
                .montoSubtotal(subtotal)
                .montoImpuesto(impuesto)
                .montoTotal(total)
                .metodoPago(metodoPago)
                .estado("PAGADA")
                .createdAt(Instant.now())
                .build();

        return facturaRepository.save(factura)
                .doOnSuccess(f -> log.info("Factura emitida exitosamente: {} por un total de {}", f.getNumeroFactura(), f.getMontoTotal()));
    }
}

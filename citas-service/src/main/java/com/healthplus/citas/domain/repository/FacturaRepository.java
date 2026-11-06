package com.healthplus.citas.domain.repository;

import com.healthplus.citas.domain.model.Factura;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface FacturaRepository extends ReactiveCrudRepository<Factura, UUID> {

    Flux<Factura> findAllByOrderByCreatedAtDesc();

    Flux<Factura> findByPacienteIdOrderByCreatedAtDesc(UUID pacienteId);

    Mono<Factura> findByNumeroFactura(String numeroFactura);

    Mono<Boolean> existsByNumeroFactura(String numeroFactura);
}

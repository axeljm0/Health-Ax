package com.healthplus.citas.domain.repository;

import com.healthplus.citas.domain.model.Paciente;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface PacienteRepository extends ReactiveCrudRepository<Paciente, UUID> {

    Mono<Paciente> findByDocumento(String documento);

    Mono<Paciente> findByCorreo(String correo);

    Mono<Boolean> existsByDocumento(String documento);

    Mono<Boolean> existsByCorreo(String correo);

    Flux<Paciente> findAllByOrderByCreatedAtDesc();
}

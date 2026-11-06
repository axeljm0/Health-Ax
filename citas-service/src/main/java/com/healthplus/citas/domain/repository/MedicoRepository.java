package com.healthplus.citas.domain.repository;

import com.healthplus.citas.domain.model.Medico;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface MedicoRepository extends ReactiveCrudRepository<Medico, UUID> {

    Mono<Medico> findByLicenciaMedica(String licenciaMedica);

    Mono<Boolean> existsByLicenciaMedica(String licenciaMedica);

    Flux<Medico> findByActivoTrue();

    Flux<Medico> findAllByOrderByNombreAsc();
}

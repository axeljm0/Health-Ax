package com.healthplus.citas.domain.repository;

import com.healthplus.citas.domain.model.Receta;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface RecetaRepository extends ReactiveCrudRepository<Receta, UUID> {

    Flux<Receta> findByPacienteIdOrderByCreatedAtDesc(UUID pacienteId);

    Flux<Receta> findByCitaId(UUID citaId);

    Flux<Receta> findAllByOrderByCreatedAtDesc();
}

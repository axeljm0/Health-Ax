package com.healthplus.citas.application.service;

import com.healthplus.citas.application.dto.DashboardStatsResponse;
import com.healthplus.citas.domain.repository.CitaRepository;
import com.healthplus.citas.domain.repository.MedicoRepository;
import com.healthplus.citas.domain.repository.PacienteRepository;
import com.healthplus.citas.domain.repository.RecetaRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
public class DashboardService {

    private final PacienteRepository pacienteRepository;
    private final CitaRepository citaRepository;
    private final RecetaRepository recetaRepository;
    private final MedicoRepository medicoRepository;

    public DashboardService(PacienteRepository pacienteRepository,
                            CitaRepository citaRepository,
                            RecetaRepository recetaRepository,
                            MedicoRepository medicoRepository) {
        this.pacienteRepository = pacienteRepository;
        this.citaRepository = citaRepository;
        this.recetaRepository = recetaRepository;
        this.medicoRepository = medicoRepository;
    }

    public Mono<DashboardStatsResponse> obtenerEstadisticas() {
        Instant inicioHoy = LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant finHoy = LocalDate.now(ZoneOffset.UTC).plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        Mono<Long> totalPacientesMono = pacienteRepository.count();
        Mono<Long> citasHoyMono = citaRepository.countByFechaHoraBetween(inicioHoy, finHoy);
        Mono<Long> recetasMono = recetaRepository.count();
        Mono<Long> medicosMono = medicoRepository.count();

        return Mono.zip(totalPacientesMono, citasHoyMono, recetasMono, medicosMono)
                .map(tuple -> new DashboardStatsResponse(
                        tuple.getT1(),
                        tuple.getT2(),
                        tuple.getT3(),
                        tuple.getT4()
                ));
    }
}

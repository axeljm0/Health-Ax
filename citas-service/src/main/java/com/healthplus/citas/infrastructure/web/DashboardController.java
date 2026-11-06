package com.healthplus.citas.infrastructure.web;

import com.healthplus.citas.application.dto.DashboardStatsResponse;
import com.healthplus.citas.application.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public Mono<DashboardStatsResponse> obtenerEstadisticas() {
        return dashboardService.obtenerEstadisticas();
    }
}

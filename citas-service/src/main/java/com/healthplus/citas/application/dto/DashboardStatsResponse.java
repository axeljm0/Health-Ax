package com.healthplus.citas.application.dto;

public class DashboardStatsResponse {

    private long totalPacientes;
    private long citasHoy;
    private long recetasEmitidas;
    private long totalMedicos;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalPacientes, long citasHoy, long recetasEmitidas, long totalMedicos) {
        this.totalPacientes = totalPacientes;
        this.citasHoy = citasHoy;
        this.recetasEmitidas = recetasEmitidas;
        this.totalMedicos = totalMedicos;
    }

    public long getTotalPacientes() { return totalPacientes; }
    public void setTotalPacientes(long totalPacientes) { this.totalPacientes = totalPacientes; }

    public long getCitasHoy() { return citasHoy; }
    public void setCitasHoy(long citasHoy) { this.citasHoy = citasHoy; }

    public long getRecetasEmitidas() { return recetasEmitidas; }
    public void setRecetasEmitidas(long recetasEmitidas) { this.recetasEmitidas = recetasEmitidas; }

    public long getTotalMedicos() { return totalMedicos; }
    public void setTotalMedicos(long totalMedicos) { this.totalMedicos = totalMedicos; }
}

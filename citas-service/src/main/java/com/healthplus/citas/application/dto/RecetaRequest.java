package com.healthplus.citas.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class RecetaRequest {

    private UUID citaId;

    @NotNull(message = "El pacienteId es obligatorio")
    private UUID pacienteId;

    @NotNull(message = "El medicoId es obligatorio")
    private UUID medicoId;

    @NotBlank(message = "Los medicamentos son obligatorios")
    private String medicamentos;

    private String indicacionesGenerales;

    private String firmaDigital;

    public RecetaRequest() {
    }

    public RecetaRequest(UUID citaId, UUID pacienteId, UUID medicoId, String medicamentos,
                         String indicacionesGenerales, String firmaDigital) {
        this.citaId = citaId;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.medicamentos = medicamentos;
        this.indicacionesGenerales = indicacionesGenerales;
        this.firmaDigital = firmaDigital;
    }

    public UUID getCitaId() { return citaId; }
    public void setCitaId(UUID citaId) { this.citaId = citaId; }

    public UUID getPacienteId() { return pacienteId; }
    public void setPacienteId(UUID pacienteId) { this.pacienteId = pacienteId; }

    public UUID getMedicoId() { return medicoId; }
    public void setMedicoId(UUID medicoId) { this.medicoId = medicoId; }

    public String getMedicamentos() { return medicamentos; }
    public void setMedicamentos(String medicamentos) { this.medicamentos = medicamentos; }

    public String getIndicacionesGenerales() { return indicacionesGenerales; }
    public void setIndicacionesGenerales(String indicacionesGenerales) { this.indicacionesGenerales = indicacionesGenerales; }

    public String getFirmaDigital() { return firmaDigital; }
    public void setFirmaDigital(String firmaDigital) { this.firmaDigital = firmaDigital; }
}

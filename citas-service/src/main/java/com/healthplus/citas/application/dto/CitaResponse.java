package com.healthplus.citas.application.dto;

import com.healthplus.citas.domain.model.Cita;

import java.time.Instant;
import java.util.UUID;

public class CitaResponse {

    private UUID id;
    private UUID pacienteId;
    private UUID medicoId;
    private Instant fechaHora;
    private String estado;
    private String motivoConsulta;
    private Instant createdAt;
    private Instant updatedAt;

    public CitaResponse() {
    }

    public CitaResponse(UUID id, UUID pacienteId, UUID medicoId, Instant fechaHora, String estado, String motivoConsulta, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.motivoConsulta = motivoConsulta;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID pacienteId;
        private UUID medicoId;
        private Instant fechaHora;
        private String estado;
        private String motivoConsulta;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder pacienteId(UUID pacienteId) { this.pacienteId = pacienteId; return this; }
        public Builder medicoId(UUID medicoId) { this.medicoId = medicoId; return this; }
        public Builder fechaHora(Instant fechaHora) { this.fechaHora = fechaHora; return this; }
        public Builder estado(String estado) { this.estado = estado; return this; }
        public Builder motivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public CitaResponse build() {
            return new CitaResponse(id, pacienteId, medicoId, fechaHora, estado, motivoConsulta, createdAt, updatedAt);
        }
    }

    public static CitaResponse fromDomain(Cita cita) {
        return CitaResponse.builder()
                .id(cita.getId())
                .pacienteId(cita.getPacienteId())
                .medicoId(cita.getMedicoId())
                .fechaHora(cita.getFechaHora())
                .estado(cita.getEstado())
                .motivoConsulta(cita.getMotivoConsulta())
                .createdAt(cita.getCreatedAt())
                .updatedAt(cita.getUpdatedAt())
                .build();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getPacienteId() { return pacienteId; }
    public void setPacienteId(UUID pacienteId) { this.pacienteId = pacienteId; }
    public UUID getMedicoId() { return medicoId; }
    public void setMedicoId(UUID medicoId) { this.medicoId = medicoId; }
    public Instant getFechaHora() { return fechaHora; }
    public void setFechaHora(Instant fechaHora) { this.fechaHora = fechaHora; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

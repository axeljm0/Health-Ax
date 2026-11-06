package com.healthplus.citas.application.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public class CitaRequest {

    @NotNull(message = "El pacienteId es obligatorio")
    private UUID pacienteId;

    @NotNull(message = "El medicoId es obligatorio")
    private UUID medicoId;

    @NotNull(message = "La fechaHora es obligatoria")
    @Future(message = "La fecha y hora de la cita debe ser en el futuro")
    private Instant fechaHora;

    @NotBlank(message = "El motivo de consulta no puede estar vacío")
    @Size(max = 255, message = "El motivo de consulta no puede exceder los 255 caracteres")
    private String motivoConsulta;

    public CitaRequest() {
    }

    public CitaRequest(UUID pacienteId, UUID medicoId, Instant fechaHora, String motivoConsulta) {
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.fechaHora = fechaHora;
        this.motivoConsulta = motivoConsulta;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID pacienteId;
        private UUID medicoId;
        private Instant fechaHora;
        private String motivoConsulta;

        public Builder pacienteId(UUID pacienteId) { this.pacienteId = pacienteId; return this; }
        public Builder medicoId(UUID medicoId) { this.medicoId = medicoId; return this; }
        public Builder fechaHora(Instant fechaHora) { this.fechaHora = fechaHora; return this; }
        public Builder motivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; return this; }

        public CitaRequest build() {
            return new CitaRequest(pacienteId, medicoId, fechaHora, motivoConsulta);
        }
    }

    public UUID getPacienteId() { return pacienteId; }
    public void setPacienteId(UUID pacienteId) { this.pacienteId = pacienteId; }
    public UUID getMedicoId() { return medicoId; }
    public void setMedicoId(UUID medicoId) { this.medicoId = medicoId; }
    public Instant getFechaHora() { return fechaHora; }
    public void setFechaHora(Instant fechaHora) { this.fechaHora = fechaHora; }
    public String getMotivoConsulta() { return motivoConsulta; }
    public void setMotivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; }
}

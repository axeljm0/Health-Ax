package com.healthplus.citas.domain.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("citas")
public class Cita {

    @Id
    private UUID id;

    @Column("paciente_id")
    private UUID pacienteId;

    @Column("medico_id")
    private UUID medicoId;

    @Column("fecha_hora")
    private Instant fechaHora;

    private String estado;

    @Column("motivo_consulta")
    private String motivoConsulta;

    @CreatedDate
    @Column("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private Instant updatedAt;

    public Cita() {
    }

    public Cita(UUID id, UUID pacienteId, UUID medicoId, Instant fechaHora, String estado, String motivoConsulta, Instant createdAt, Instant updatedAt) {
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

        public Cita build() {
            return new Cita(id, pacienteId, medicoId, fechaHora, estado, motivoConsulta, createdAt, updatedAt);
        }
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

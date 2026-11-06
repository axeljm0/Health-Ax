package com.healthplus.citas.domain.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("recetas")
public class Receta {

    @Id
    private UUID id;

    @Column("cita_id")
    private UUID citaId;

    @Column("paciente_id")
    private UUID pacienteId;

    @Column("medico_id")
    private UUID medicoId;

    private String medicamentos;

    @Column("indicaciones_generales")
    private String indicacionesGenerales;

    @Column("firma_digital")
    private String firmaDigital;

    @Column("fecha_emision")
    private Instant fechaEmision;

    @CreatedDate
    @Column("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private Instant updatedAt;

    public Receta() {
    }

    public Receta(UUID id, UUID citaId, UUID pacienteId, UUID medicoId, String medicamentos, String indicacionesGenerales, String firmaDigital, Instant fechaEmision, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.citaId = citaId;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.medicamentos = medicamentos;
        this.indicacionesGenerales = indicacionesGenerales;
        this.firmaDigital = firmaDigital;
        this.fechaEmision = fechaEmision;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private UUID citaId;
        private UUID pacienteId;
        private UUID medicoId;
        private String medicamentos;
        private String indicacionesGenerales;
        private String firmaDigital;
        private Instant fechaEmision;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder citaId(UUID citaId) { this.citaId = citaId; return this; }
        public Builder pacienteId(UUID pacienteId) { this.pacienteId = pacienteId; return this; }
        public Builder medicoId(UUID medicoId) { this.medicoId = medicoId; return this; }
        public Builder medicamentos(String medicamentos) { this.medicamentos = medicamentos; return this; }
        public Builder indicacionesGenerales(String indicacionesGenerales) { this.indicacionesGenerales = indicacionesGenerales; return this; }
        public Builder firmaDigital(String firmaDigital) { this.firmaDigital = firmaDigital; return this; }
        public Builder fechaEmision(Instant fechaEmision) { this.fechaEmision = fechaEmision; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Receta build() {
            return new Receta(id, citaId, pacienteId, medicoId, medicamentos, indicacionesGenerales, firmaDigital, fechaEmision, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
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
    public Instant getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(Instant fechaEmision) { this.fechaEmision = fechaEmision; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

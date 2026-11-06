package com.healthplus.citas.domain.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("medicos")
public class Medico {

    @Id
    private UUID id;

    private String nombre;
    private String especialidad;

    @Column("licencia_medica")
    private String licenciaMedica;

    private Boolean activo;

    @CreatedDate
    @Column("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private Instant updatedAt;

    public Medico() {
    }

    public Medico(UUID id, String nombre, String especialidad, String licenciaMedica, Boolean activo, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.licenciaMedica = licenciaMedica;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String nombre;
        private String especialidad;
        private String licenciaMedica;
        private Boolean activo = true;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder especialidad(String especialidad) { this.especialidad = especialidad; return this; }
        public Builder licenciaMedica(String licenciaMedica) { this.licenciaMedica = licenciaMedica; return this; }
        public Builder activo(Boolean activo) { this.activo = activo; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Medico build() {
            return new Medico(id, nombre, especialidad, licenciaMedica, activo, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    public String getLicenciaMedica() { return licenciaMedica; }
    public void setLicenciaMedica(String licenciaMedica) { this.licenciaMedica = licenciaMedica; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

package com.healthplus.citas.domain.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("pacientes")
public class Paciente {

    @Id
    private UUID id;

    private String documento;
    private String nombre;
    private String correo;
    private String telefono;

    @Column("historial_id")
    private UUID historialId;

    @CreatedDate
    @Column("created_at")
    private Instant createdAt;

    @LastModifiedDate
    @Column("updated_at")
    private Instant updatedAt;

    public Paciente() {
    }

    public Paciente(UUID id, String documento, String nombre, String correo, String telefono, UUID historialId, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.documento = documento;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.historialId = historialId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String documento;
        private String nombre;
        private String correo;
        private String telefono;
        private UUID historialId;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder documento(String documento) { this.documento = documento; return this; }
        public Builder nombre(String nombre) { this.nombre = nombre; return this; }
        public Builder correo(String correo) { this.correo = correo; return this; }
        public Builder telefono(String telefono) { this.telefono = telefono; return this; }
        public Builder historialId(UUID historialId) { this.historialId = historialId; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(Instant updatedAt) { this.updatedAt = updatedAt; return this; }

        public Paciente build() {
            return new Paciente(id, documento, nombre, correo, telefono, historialId, createdAt, updatedAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public UUID getHistorialId() { return historialId; }
    public void setHistorialId(UUID historialId) { this.historialId = historialId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

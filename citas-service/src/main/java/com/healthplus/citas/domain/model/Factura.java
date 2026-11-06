package com.healthplus.citas.domain.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Table("facturas")
public class Factura {

    @Id
    private UUID id;

    @Column("numero_factura")
    private String numeroFactura;

    @Column("cita_id")
    private UUID citaId;

    @Column("paciente_id")
    private UUID pacienteId;

    @Column("medico_id")
    private UUID medicoId;

    private String concepto;

    @Column("monto_subtotal")
    private BigDecimal montoSubtotal;

    @Column("monto_impuesto")
    private BigDecimal montoImpuesto;

    @Column("monto_total")
    private BigDecimal montoTotal;

    @Column("metodo_pago")
    private String metodoPago;

    private String estado;

    @CreatedDate
    @Column("created_at")
    private Instant createdAt;

    public Factura() {
    }

    public Factura(UUID id, String numeroFactura, UUID citaId, UUID pacienteId, UUID medicoId,
                   String concepto, BigDecimal montoSubtotal, BigDecimal montoImpuesto,
                   BigDecimal montoTotal, String metodoPago, String estado, Instant createdAt) {
        this.id = id;
        this.numeroFactura = numeroFactura;
        this.citaId = citaId;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.concepto = concepto;
        this.montoSubtotal = montoSubtotal;
        this.montoImpuesto = montoImpuesto;
        this.montoTotal = montoTotal;
        this.metodoPago = metodoPago;
        this.estado = estado;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private UUID id;
        private String numeroFactura;
        private UUID citaId;
        private UUID pacienteId;
        private UUID medicoId;
        private String concepto;
        private BigDecimal montoSubtotal;
        private BigDecimal montoImpuesto;
        private BigDecimal montoTotal;
        private String metodoPago;
        private String estado;
        private Instant createdAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder numeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; return this; }
        public Builder citaId(UUID citaId) { this.citaId = citaId; return this; }
        public Builder pacienteId(UUID pacienteId) { this.pacienteId = pacienteId; return this; }
        public Builder medicoId(UUID medicoId) { this.medicoId = medicoId; return this; }
        public Builder concepto(String concepto) { this.concepto = concepto; return this; }
        public Builder montoSubtotal(BigDecimal montoSubtotal) { this.montoSubtotal = montoSubtotal; return this; }
        public Builder montoImpuesto(BigDecimal montoImpuesto) { this.montoImpuesto = montoImpuesto; return this; }
        public Builder montoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; return this; }
        public Builder metodoPago(String metodoPago) { this.metodoPago = metodoPago; return this; }
        public Builder estado(String estado) { this.estado = estado; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }

        public Factura build() {
            return new Factura(id, numeroFactura, citaId, pacienteId, medicoId, concepto,
                    montoSubtotal, montoImpuesto, montoTotal, metodoPago, estado, createdAt);
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }
    public UUID getCitaId() { return citaId; }
    public void setCitaId(UUID citaId) { this.citaId = citaId; }
    public UUID getPacienteId() { return pacienteId; }
    public void setPacienteId(UUID pacienteId) { this.pacienteId = pacienteId; }
    public UUID getMedicoId() { return medicoId; }
    public void setMedicoId(UUID medicoId) { this.medicoId = medicoId; }
    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }
    public BigDecimal getMontoSubtotal() { return montoSubtotal; }
    public void setMontoSubtotal(BigDecimal montoSubtotal) { this.montoSubtotal = montoSubtotal; }
    public BigDecimal getMontoImpuesto() { return montoImpuesto; }
    public void setMontoImpuesto(BigDecimal montoImpuesto) { this.montoImpuesto = montoImpuesto; }
    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }
    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

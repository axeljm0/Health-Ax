package com.healthplus.citas.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public class FacturaRequest {

    private UUID citaId;

    @NotNull(message = "El pacienteId es obligatorio")
    private UUID pacienteId;

    @NotNull(message = "El medicoId es obligatorio")
    private UUID medicoId;

    @NotBlank(message = "El concepto de la factura es obligatorio")
    @Size(max = 255, message = "El concepto no puede superar los 255 caracteres")
    private String concepto;

    @NotNull(message = "El monto subtotal es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto subtotal debe ser mayor a 0")
    private BigDecimal montoSubtotal;

    private BigDecimal montoImpuesto;

    private BigDecimal montoTotal;

    private String metodoPago;

    public FacturaRequest() {
    }

    public FacturaRequest(UUID citaId, UUID pacienteId, UUID medicoId, String concepto,
                          BigDecimal montoSubtotal, BigDecimal montoImpuesto,
                          BigDecimal montoTotal, String metodoPago) {
        this.citaId = citaId;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.concepto = concepto;
        this.montoSubtotal = montoSubtotal;
        this.montoImpuesto = montoImpuesto;
        this.montoTotal = montoTotal;
        this.metodoPago = metodoPago;
    }

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
}

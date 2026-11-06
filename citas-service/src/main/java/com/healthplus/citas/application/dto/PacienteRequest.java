package com.healthplus.citas.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PacienteRequest {

    @NotBlank(message = "El documento es obligatorio")
    @Size(max = 20, message = "El documento no puede exceder los 20 caracteres")
    private String documento;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder los 150 caracteres")
    private String nombre;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo electrónico debe ser válido")
    @Size(max = 100, message = "El correo no puede exceder los 100 caracteres")
    private String correo;

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 25, message = "El teléfono no puede exceder los 25 caracteres")
    private String telefono;

    public PacienteRequest() {
    }

    public PacienteRequest(String documento, String nombre, String correo, String telefono) {
        this.documento = documento;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
    }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}

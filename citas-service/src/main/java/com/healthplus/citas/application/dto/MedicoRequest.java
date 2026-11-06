package com.healthplus.citas.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MedicoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede exceder los 150 caracteres")
    private String nombre;

    @NotBlank(message = "La especialidad es obligatoria")
    @Size(max = 100, message = "La especialidad no puede exceder los 100 caracteres")
    private String especialidad;

    @NotBlank(message = "La licencia médica es obligatoria")
    @Size(max = 50, message = "La licencia médica no puede exceder los 50 caracteres")
    private String licenciaMedica;

    public MedicoRequest() {
    }

    public MedicoRequest(String nombre, String especialidad, String licenciaMedica) {
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.licenciaMedica = licenciaMedica;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public String getLicenciaMedica() { return licenciaMedica; }
    public void setLicenciaMedica(String licenciaMedica) { this.licenciaMedica = licenciaMedica; }
}

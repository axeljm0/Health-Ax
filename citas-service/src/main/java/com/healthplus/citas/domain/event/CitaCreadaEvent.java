package com.healthplus.citas.domain.event;

import com.healthplus.citas.domain.model.Cita;

import java.time.Instant;
import java.util.UUID;

public class CitaCreadaEvent {

    private String specversion = "1.0";
    private String id = UUID.randomUUID().toString();
    private String source = "https://healthplus.com/citas-service";
    private String type = "com.healthplus.citas.cita.creada.v1";
    private String datacontenttype = "application/json";
    private Instant time = Instant.now();
    private String correlationId;
    private CitaData data;

    public CitaCreadaEvent() {
    }

    public CitaCreadaEvent(String specversion, String id, String source, String type, String datacontenttype, Instant time, String correlationId, CitaData data) {
        this.specversion = specversion;
        this.id = id;
        this.source = source;
        this.type = type;
        this.datacontenttype = datacontenttype;
        this.time = time;
        this.correlationId = correlationId;
        this.data = data;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String specversion = "1.0";
        private String id = UUID.randomUUID().toString();
        private String source = "https://healthplus.com/citas-service";
        private String type = "com.healthplus.citas.cita.creada.v1";
        private String datacontenttype = "application/json";
        private Instant time = Instant.now();
        private String correlationId;
        private CitaData data;

        public Builder specversion(String specversion) { this.specversion = specversion; return this; }
        public Builder id(String id) { this.id = id; return this; }
        public Builder source(String source) { this.source = source; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder datacontenttype(String datacontenttype) { this.datacontenttype = datacontenttype; return this; }
        public Builder time(Instant time) { this.time = time; return this; }
        public Builder correlationId(String correlationId) { this.correlationId = correlationId; return this; }
        public Builder data(CitaData data) { this.data = data; return this; }

        public CitaCreadaEvent build() {
            return new CitaCreadaEvent(specversion, id, source, type, datacontenttype, time, correlationId, data);
        }
    }

    public static class CitaData {
        private UUID citaId;
        private UUID pacienteId;
        private UUID medicoId;
        private Instant fechaHora;
        private String estado;
        private String motivoConsulta;

        public CitaData() {}

        public CitaData(UUID citaId, UUID pacienteId, UUID medicoId, Instant fechaHora, String estado, String motivoConsulta) {
            this.citaId = citaId;
            this.pacienteId = pacienteId;
            this.medicoId = medicoId;
            this.fechaHora = fechaHora;
            this.estado = estado;
            this.motivoConsulta = motivoConsulta;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private UUID citaId;
            private UUID pacienteId;
            private UUID medicoId;
            private Instant fechaHora;
            private String estado;
            private String motivoConsulta;

            public Builder citaId(UUID citaId) { this.citaId = citaId; return this; }
            public Builder pacienteId(UUID pacienteId) { this.pacienteId = pacienteId; return this; }
            public Builder medicoId(UUID medicoId) { this.medicoId = medicoId; return this; }
            public Builder fechaHora(Instant fechaHora) { this.fechaHora = fechaHora; return this; }
            public Builder estado(String estado) { this.estado = estado; return this; }
            public Builder motivoConsulta(String motivoConsulta) { this.motivoConsulta = motivoConsulta; return this; }

            public CitaData build() {
                return new CitaData(citaId, pacienteId, medicoId, fechaHora, estado, motivoConsulta);
            }
        }

        public UUID getCitaId() { return citaId; }
        public void setCitaId(UUID citaId) { this.citaId = citaId; }
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
    }

    public static CitaCreadaEvent fromCita(Cita cita, String correlationId) {
        return CitaCreadaEvent.builder()
                .correlationId(correlationId != null ? correlationId : UUID.randomUUID().toString())
                .data(CitaData.builder()
                        .citaId(cita.getId())
                        .pacienteId(cita.getPacienteId())
                        .medicoId(cita.getMedicoId())
                        .fechaHora(cita.getFechaHora())
                        .estado(cita.getEstado())
                        .motivoConsulta(cita.getMotivoConsulta())
                        .build())
                .build();
    }

    public String getSpecversion() { return specversion; }
    public void setSpecversion(String specversion) { this.specversion = specversion; }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDatacontenttype() { return datacontenttype; }
    public void setDatacontenttype(String datacontenttype) { this.datacontenttype = datacontenttype; }
    public Instant getTime() { return time; }
    public void setTime(Instant time) { this.time = time; }
    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
    public CitaData getData() { return data; }
    public void setData(CitaData data) { this.data = data; }
}

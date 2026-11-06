# Health+ | Plataforma de Gestión Clínica Reactiva

Backend de alto rendimiento para el sistema de gestión clínica **Health+**, construido bajo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**, **SOLID**, **Reactividad Pura de Extremo a Extremo (Project Reactor sin bloqueos)** y **Alta Disponibilidad con Rate Limiting distribuido**.

---

## 🏗️ Arquitectura General

```
                            [ Cliente Web / Móvil ]
                                       │
                                       ▼ (HTTP / REST)
               ┌──────────────────────────────────────────────────┐
               │    API GATEWAY (Spring Cloud Gateway : 8080)     │
               │    - Algoritmo Token Bucket                      │
               │    - Rate Limiting por JWT (sub) o IP remota     │
               └───────────────┬───────────────────┬──────────────┘
                               │                   │
                 (Tokens OK)   ▼                   ▼ (Token Bucket)
               ┌─────────────────────┐    ┌─────────────────────┐
               │    citas-service    │    │     REDIS (6379)    │
               │    Port: 8081       │    │ - Rate Limit Keys   │
               │ (Spring WebFlux)    │    │ - Distributed Lock  │
               └──────────┬──────────┘    └──────────▲──────────┘
                          │                          │ (SETNX lock:medico)
             ┌────────────┴────────────┐             │
             │                         │             │
             ▼                         ▼             │
┌─────────────────────────┐   ┌──────────────────────┴┐
│   POSTGRESQL (5432)     │   │   APACHE KAFKA (9092) │
│ - R2DBC (No bloqueante) │   │ - Modo KRaft (sin ZK) │
│ - Citas, Médicos, etc.  │   │ - healthplus.citas... │
└─────────────────────────┘   └──────────┬────────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │  KAFKA-UI (8085)     │
                              │  Inspección visual   │
                              └──────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
Health-plus/
├── pom.xml                               # Aggregator Maven Padre
├── docker-compose.yml                    # Postgres 16, Redis 7, Kafka KRaft y Kafka-UI
├── docker/
│   └── postgres/
│       └── init.sql                      # DDL, índices de alta concurrencia y seed data
├── api-gateway/                          # Módulo Gateway
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/healthplus/gateway/
│       │   ├── ApiGatewayApplication.java
│       │   └── config/
│       │       └── KeyResolverConfiguration.java
│       └── resources/
│           └── application.yml
├── citas-service/                        # Módulo Core Citas (Arquitectura Hexagonal)
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/
│       ├── java/com/healthplus/citas/
│       │   ├── CitasServiceApplication.java
│       │   ├── domain/                   # Capa de Dominio (Entidades, Eventos, Repositorios)
│       │   │   ├── model/
│       │   │   │   ├── Cita.java
│       │   │   │   └── EstadoCita.java
│       │   │   ├── event/
│       │   │   │   └── CitaCreadaEvent.java
│       │   │   └── repository/
│       │   │       └── CitaRepository.java
│       │   ├── application/              # Capa de Aplicación (Casos de Uso / Servicios, DTOs)
│       │   │   ├── dto/
│       │   │   │   ├── CitaRequest.java
│       │   │   │   └── CitaResponse.java
│       │   │   └── service/
│       │   │       └── CitaService.java  # Bloqueo distribuido Redis + R2DBC + Kafka
│       │   └── infrastructure/           # Capa de Infraestructura (Web, Configs, Exceptions)
│       │       ├── config/
│       │       │   ├── ReactiveKafkaProducerConfig.java
│       │       │   └── R2dbcAuditingConfig.java
│       │       ├── exception/
│       │       │   ├── CitaConflictException.java
│       │       │   └── GlobalExceptionHandler.java
│       │       └── web/
│       │           └── CitaController.java
│       └── resources/
│           └── application.yml
├── frontend/                             # Aplicación React 18+ (Vite, TypeScript, Tailwind CSS)
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx                       # Dashboard clínico y visualizador de estado
│       ├── components/
│       │   ├── Navbar.tsx                # Cabecera con monitor de estado y accesos
│       │   ├── AgendarCitaModal.tsx      # Modal de reserva con feedback de errores 409/429
│       │   ├── CitasList.tsx             # Listado reactivo de citas con filtros
│       │   └── DevStressPanel.tsx        # Simulador interactivo de concurrencia y ráfagas
│       ├── services/api.ts               # Cliente Axios y pruebas de estrés
│       └── types/index.ts                # Modelos TypeScript
└── scripts/
    └── test-endpoints.sh                 # Script bash para pruebas de flujo y concurrencia
```

---

## 🚀 Despliegue y Ejecución

### 1. Iniciar Infraestructura con Docker Compose
```bash
docker-compose up -d postgres redis kafka kafka-ui
```

### 2. Iniciar el Frontend React en Modo Desarrollo
```bash
cd frontend
npm install
npm run dev
```
La aplicación abrirá en **http://localhost:3000** con hot-reload y proxy automático hacia el API Gateway.

### 3. Levantar Todo el Ecosistema Contenerizado (Infra + Backend + Frontend)
```bash
docker-compose --profile apps up --build -d
```

---

## 🌐 Puertos del Ecosistema

| Servicio | Puerto | Descripción |
|---|---|---|
| **Frontend React** | `3000` | Interfaz de usuario clínica y panel interactivo |
| **API Gateway** | `8080` | Puerta de entrada con Rate Limiting y enrutamiento |
| **Citas Service** | `8081` | Microservicio reactivo de gestión de citas |
| **Kafka-UI** | `8085` | Consola web para monitorear tópicos y mensajes Kafka |
| **PostgreSQL** | `5432` | Base de datos relacional (Base: `healthplus_db`) |
| **Redis** | `6379` | In-memory cache para locks atómicos y token buckets |
| **Kafka Broker** | `9092` | Broker Kafka (KRaft mode) |

---

## 🧪 Pruebas de API y Concurrencia

### 1. Ejecución Automatizada
Ejecuta el script incluido:
```bash
./scripts/test-endpoints.sh
```

### 2. Pruebas Manuales con `curl`

#### Agendar Cita Exitosa (HTTP 201 Created)
```bash
curl -X POST http://localhost:8080/api/v1/citas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT_OPCIONAL>" \
  -d '{
    "pacienteId": "c71e21b8-3e4b-4f51-b011-85b3cb29df33",
    "medicoId": "f8a1a382-7f99-4c12-8e11-d0db341a99f1",
    "fechaHora": "2026-11-20T10:00:00Z",
    "motivoConsulta": "Control preventivo de cardiología"
  }'
```

#### Simular Concurrencia / Double Booking (HTTP 409 Conflict)
Al intentar enviar inmediatamente otra cita con el **mismo `medicoId` y `fechaHora`**, Redis activará el candado atómico y devolverá:
```json
{
  "timestamp": "2026-11-03T20:30:00Z",
  "status": 409,
  "error": "Conflict",
  "message": "El médico seleccionado no tiene disponibilidad para el horario solicitado."
}
```

#### Comprobar Eventos en Kafka-UI
Abre en tu navegador `http://localhost:8085` y navega hacia el tópico `healthplus.citas.cita.creada.v1` para observar el mensaje estructurado con el formato CloudEvent emitido en tiempo real.

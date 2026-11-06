CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: HISTORIAL CLÍNICO
CREATE TABLE IF NOT EXISTS historial_clinico (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_expediente VARCHAR(50) NOT NULL UNIQUE,
    antecedentes_medicos JSONB DEFAULT '{}'::jsonb,
    alergias TEXT[],
    observaciones_generales TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. TABLA: PACIENTES
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(25) NOT NULL,
    historial_id UUID UNIQUE REFERENCES historial_clinico(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. TABLA: MEDICOS
CREATE TABLE IF NOT EXISTS medicos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    licencia_medica VARCHAR(50) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. TABLA: CITAS
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id UUID NOT NULL REFERENCES medicos(id) ON DELETE RESTRICT,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(30) DEFAULT 'PENDIENTE' NOT NULL CHECK (estado IN ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA')),
    motivo_consulta VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. TABLA: RECETAS
CREATE TABLE IF NOT EXISTS recetas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id UUID NOT NULL REFERENCES medicos(id) ON DELETE RESTRICT,
    medicamentos JSONB NOT NULL,
    indicaciones_generales TEXT,
    firma_digital VARCHAR(512) NOT NULL,
    fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 6. TABLA: FACTURAS
CREATE TABLE IF NOT EXISTS facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    cita_id UUID REFERENCES citas(id) ON DELETE SET NULL,
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id UUID NOT NULL REFERENCES medicos(id) ON DELETE RESTRICT,
    concepto VARCHAR(255) NOT NULL,
    monto_subtotal NUMERIC(10, 2) NOT NULL,
    monto_impuesto NUMERIC(10, 2) NOT NULL,
    monto_total NUMERIC(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'EFECTIVO' NOT NULL,
    estado VARCHAR(50) DEFAULT 'PAGADA' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_medico_slot_activo 
ON citas (medico_id, fecha_hora) 
WHERE estado IN ('PENDIENTE', 'CONFIRMADA');

CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas (paciente_id, fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_pacientes_documento ON pacientes (documento);
CREATE INDEX IF NOT EXISTS idx_recetas_cita ON recetas (cita_id);
CREATE INDEX IF NOT EXISTS idx_facturas_paciente ON facturas (paciente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas (numero_factura);

INSERT INTO historial_clinico (id, numero_expediente, antecedentes_medicos, alergias, observaciones_generales)
VALUES 
    ('a0000000-0000-0000-0000-000000000001', 'EXP-2026-001', '{"diabetes": false, "hipertension": true}'::jsonb, ARRAY['Penicilina'], 'Paciente con control periódico'),
    ('a0000000-0000-0000-0000-000000000002', 'EXP-2026-002', '{"asma": true}'::jsonb, ARRAY['Sulfamidas'], 'Tratamiento preventivo para alergias estacionales')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pacientes (id, documento, nombre, correo, telefono, historial_id)
VALUES 
    ('c71e21b8-3e4b-4f51-b011-85b3cb29df33', 'MEX-49382104', 'Carlos Mendoza', 'carlos.mendoza@email.com', '+525544332211', 'a0000000-0000-0000-0000-000000000001'),
    ('b22e33c4-4f5a-5e62-c122-96c4dc30ea44', 'MEX-10293847', 'Elena Morales', 'elena.morales@email.com', '+525511223344', 'a0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

INSERT INTO medicos (id, nombre, especialidad, licencia_medica, activo)
VALUES 
    ('f8a1a382-7f99-4c12-8e11-d0db341a99f1', 'Dra. Sofía Valenzuela', 'Cardiología', 'MED-CARD-99381', true),
    ('e7b2b493-8a00-4d23-9f22-e1ea452b00a2', 'Dr. Roberto Navarro', 'Pediatría', 'MED-PED-11029', true)
ON CONFLICT (id) DO NOTHING;

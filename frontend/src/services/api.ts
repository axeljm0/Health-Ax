import axios from 'axios';
import type {
  Cita, CitaRequest, Medico, MedicoRequest, Paciente, PacienteRequest,
  Factura, FacturaRequest, Receta, RecetaRequest, DashboardStats,
  HistorialClinico,
} from '../types/index.ts';
import { createRecord, deleteRecord, readCollection, updateRecord } from './localStore.js';

// Las operaciones clínicas usan localStorage como fuente inmediata de datos.
// El frontend permanece utilizable aunque los microservicios no estén levantados.
export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 6000,
});

export const MEDICOS_FALLBACK: Medico[] = [
  { id: 'f8a1a382-7f99-4c12-8e11-d0db341a99f1', nombre: 'Dra. Sofía Valenzuela', especialidad: 'Cardiología', licenciaMedica: 'MED-CARD-99381', consultorio: 'Consultorio 12', diasAtencion: 'Lun-Vie', avatarText: 'SV', activo: true },
  { id: 'e7b2b493-8a00-4d23-9f22-e1ea452b00a2', nombre: 'Dr. Roberto Navarro', especialidad: 'Pediatría', licenciaMedica: 'MED-PED-11029', consultorio: 'Consultorio 05', diasAtencion: 'Mar-Sáb', avatarText: 'RN', activo: true },
];

export const PACIENTES_FALLBACK: Paciente[] = [
  { id: 'c71e21b8-3e4b-4f51-b011-85b3cb29df33', codigo: '#PT-1042', nombre: 'Carlos Mendoza', edad: '34 años', sexo: 'M', documento: 'MEX-49382104', correo: 'carlos.mendoza@email.com', telefono: '+52 55 4433 2211' },
  { id: 'b22e33c4-4f5a-5e62-c122-96c4dc30ea44', codigo: '#PT-1043', nombre: 'Elena Morales', edad: '28 años', sexo: 'F', documento: 'MEX-10293847', correo: 'elena.morales@email.com', telefono: '+52 55 1122 3344' },
];

export const MEDICOS_MEDICORE = MEDICOS_FALLBACK;
export const PACIENTES_MEDICORE = PACIENTES_FALLBACK;

export const HISTORIALES_PREDEFINIDOS: Record<string, HistorialClinico> = {
  'Carlos Mendoza': { pacienteNombre: 'Carlos Mendoza', tipoSangre: 'O+', alergias: 'Penicilina', peso: '74 kg', eventos: [
    { fecha: '15 Octubre, 2023', titulo: 'Consulta de control de presión', descripcion: 'Paciente con hipertensión moderada. Presión arterial estable (120/80). Se mantiene medicación actual.', isRecent: true },
    { fecha: '02 Septiembre, 2023', titulo: 'Primera visita cardiológica', descripcion: 'EKG basal normal. Dieta baja en sodio y control trimestral.', isRecent: false },
  ] },
  'Elena Morales': { pacienteNombre: 'Elena Morales', tipoSangre: 'A+', alergias: 'Sulfamidas', peso: '58 kg', eventos: [
    { fecha: '20 Noviembre, 2023', titulo: 'Control alergias estacionales', descripcion: 'Tratamiento preventivo para alergias estacionales. Estado respiratorio óptimo.', isRecent: true },
  ] },
};

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0;
    return (char === 'x' ? random : (random & 0x3 | 0x8)).toString(16);
  });
}

function duplicateError(label: string): Error {
  return Object.assign(new Error(`Ya existe un registro con ${label}.`), { status: 409 });
}

function localCreate<T extends { id: string }>(collection: string, value: Omit<T, 'id'> & Partial<Pick<T, 'id'>>, initial: T[] = []): T {
  const now = new Date().toISOString();
  return createRecord(collection, { ...value, id: value.id || makeId(), createdAt: now, updatedAt: now } as unknown as T, initial);
}

function localUpdate<T extends { id: string }>(collection: string, id: string, changes: Partial<T>, initial: T[] = []): T {
  const updated = updateRecord<T>(collection, id, changes, initial);
  if (!updated) throw new Error('No se encontró el registro solicitado.');
  return updated;
}

function localDelete<T extends { id: string }>(collection: string, id: string, initial: T[] = []): void {
  if (!deleteRecord(collection, id, initial)) throw new Error('No se encontró el registro solicitado.');
}

export const ApiService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date().toISOString().slice(0, 10);
    const citas = readCollection<Cita>('citas');
    return {
      totalPacientes: readCollection('pacientes', PACIENTES_FALLBACK).length,
      totalMedicos: readCollection('medicos', MEDICOS_FALLBACK).length,
      citasHoy: citas.filter((cita) => cita.fechaHora.startsWith(today)).length,
      recetasEmitidas: readCollection<Receta>('recetas').length,
    };
  },

  async getPacientes(): Promise<Paciente[]> { return readCollection('pacientes', PACIENTES_FALLBACK); },
  async crearPaciente(request: PacienteRequest): Promise<Paciente> {
    const pacientes = readCollection('pacientes', PACIENTES_FALLBACK);
    const documento = request.documento.trim().toLowerCase();
    const correo = request.correo.trim().toLowerCase();
    if (pacientes.some((p) => p.documento.toLowerCase() === documento)) throw duplicateError('ese documento');
    if (pacientes.some((p) => p.correo.toLowerCase() === correo)) throw duplicateError('ese correo');
    return localCreate<Paciente>('pacientes', { ...request, documento: request.documento.trim(), nombre: request.nombre.trim(), correo, telefono: request.telefono.trim() }, PACIENTES_FALLBACK);
  },
  async actualizarPaciente(id: string, changes: Partial<PacienteRequest>): Promise<Paciente> { return localUpdate<Paciente>('pacientes', id, changes, PACIENTES_FALLBACK); },
  async eliminarPaciente(id: string): Promise<void> { localDelete('pacientes', id, PACIENTES_FALLBACK); },

  async getMedicos(soloActivos = false): Promise<Medico[]> {
    const medicos = readCollection('medicos', MEDICOS_FALLBACK);
    return soloActivos ? medicos.filter((medico) => medico.activo !== false) : medicos;
  },
  async crearMedico(request: MedicoRequest): Promise<Medico> {
    const medicos = readCollection('medicos', MEDICOS_FALLBACK);
    const licencia = request.licenciaMedica.trim().toLowerCase();
    if (medicos.some((m) => m.licenciaMedica.toLowerCase() === licencia)) throw duplicateError('esa licencia médica');
    return localCreate<Medico>('medicos', { ...request, nombre: request.nombre.trim(), especialidad: request.especialidad.trim(), licenciaMedica: request.licenciaMedica.trim().toUpperCase(), activo: true }, MEDICOS_FALLBACK);
  },
  async actualizarMedico(id: string, changes: Partial<MedicoRequest>): Promise<Medico> { return localUpdate<Medico>('medicos', id, changes, MEDICOS_FALLBACK); },
  async eliminarMedico(id: string): Promise<void> { localDelete('medicos', id, MEDICOS_FALLBACK); },

  async getCitas(): Promise<Cita[]> { return readCollection('citas'); },
  async agendarCita(request: CitaRequest): Promise<Cita> {
    if (!request.pacienteId || !request.medicoId || !request.motivoConsulta.trim() || Number.isNaN(Date.parse(request.fechaHora))) {
      throw new Error('Complete paciente, médico, fecha y motivo de la cita.');
    }
    const citas = readCollection<Cita>('citas');
    const slot = new Date(request.fechaHora).getTime();
    if (citas.some((cita) => cita.medicoId === request.medicoId && new Date(cita.fechaHora).getTime() === slot && cita.estado !== 'CANCELADA')) {
      throw duplicateError('una cita para ese médico y horario');
    }
    return localCreate<Cita>('citas', { ...request, estado: 'CONFIRMADA' });
  },
  async actualizarCita(id: string, changes: Partial<CitaRequest> & { estado?: Cita['estado'] }): Promise<Cita> { return localUpdate<Cita>('citas', id, changes); },
  async eliminarCita(id: string): Promise<void> { localDelete('citas', id); },
  async getCitasPorPaciente(pacienteId: string): Promise<Cita[]> { return (await this.getCitas()).filter((cita) => cita.pacienteId === pacienteId); },

  async getRecetas(): Promise<Receta[]> { return readCollection('recetas'); },
  async crearReceta(request: RecetaRequest): Promise<Receta> {
    if (!request.pacienteId || !request.medicoId || !request.medicamentos.trim()) throw new Error('Seleccione paciente, médico y escriba los medicamentos.');
    const receta = localCreate<Receta>('recetas', {
      ...request,
      medicamentos: request.medicamentos.trim(),
      firmaDigital: `LOCAL-${makeId()}`,
      fechaEmision: request.fechaEmision || new Date().toISOString(),
    });
    return receta;
  },
  async actualizarReceta(id: string, changes: Partial<RecetaRequest>): Promise<Receta> { return localUpdate<Receta>('recetas', id, changes); },
  async eliminarReceta(id: string): Promise<void> { localDelete('recetas', id); },

  async getFacturas(): Promise<Factura[]> { return readCollection('facturas'); },
  async crearFactura(request: FacturaRequest): Promise<Factura> {
    const subtotal = Number(request.montoSubtotal);
    const impuesto = Number(request.montoImpuesto ?? subtotal * 0.16);
    const factura: Factura = {
      ...request,
      id: makeId(),
      numeroFactura: `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`,
      montoSubtotal: subtotal,
      montoImpuesto: impuesto,
      montoTotal: Number(request.montoTotal ?? subtotal + impuesto),
      metodoPago: request.metodoPago || 'EFECTIVO',
      estado: 'PAGADA',
      createdAt: new Date().toISOString(),
    };
    return createRecord('facturas', factura);
  },
  async actualizarFactura(id: string, changes: Partial<FacturaRequest>): Promise<Factura> { return localUpdate<Factura>('facturas', id, changes); },
  async eliminarFactura(id: string): Promise<void> { localDelete('facturas', id); },

  async simularDobleReserva(request: CitaRequest) {
    const run = () => this.agendarCita(request).then((data) => ({ status: 201, data, ok: true })).catch((err: Error & { status?: number }) => ({ status: err.status || 500, data: err.message, ok: false }));
    return Promise.all([run(), run()]);
  },
  async simularRafagaRateLimit(pacienteId: string, totalRequests = 25) {
    const results = await Promise.all(Array.from({ length: totalRequests }, () => this.getCitasPorPaciente(pacienteId).then(() => 200).catch(() => 500)));
    const successCount = results.filter((status) => status === 200).length;
    const rateLimitedCount = results.filter((status) => status === 429).length;
    return { total: totalRequests, success: successCount, rateLimited: rateLimitedCount, other: totalRequests - successCount - rateLimitedCount, codes: results };
  },
};

export const CitaService = ApiService;

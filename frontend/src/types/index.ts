export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA';

export type TabType = 'dashboard' | 'pacientes' | 'medicos' | 'citas' | 'recetas' | 'facturas';

export interface DashboardStats {
  totalPacientes: number;
  citasHoy: number;
  recetasEmitidas: number;
  totalMedicos?: number;
}

export interface Cita {
  id: string;
  pacienteId: string;
  medicoId: string;
  fechaHora: string;
  estado: EstadoCita;
  motivoConsulta: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CitaRequest {
  pacienteId: string;
  medicoId: string;
  fechaHora: string;
  motivoConsulta: string;
}

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
  licenciaMedica: string;
  activo: boolean;
  consultorio?: string;
  diasAtencion?: string;
  avatarText?: string;
  createdAt?: string;
}

export interface MedicoRequest {
  nombre: string;
  especialidad: string;
  licenciaMedica: string;
}

export interface Paciente {
  id: string;
  documento: string;
  nombre: string;
  correo: string;
  telefono: string;
  historialId?: string;
  codigo?: string;
  edad?: string;
  sexo?: 'M' | 'F';
  createdAt?: string;
}

export interface PacienteRequest {
  documento: string;
  nombre: string;
  correo: string;
  telefono: string;
}

export interface Factura {
  id: string;
  numeroFactura: string;
  citaId?: string;
  pacienteId: string;
  medicoId: string;
  concepto: string;
  montoSubtotal: number;
  montoImpuesto: number;
  montoTotal: number;
  metodoPago: string;
  estado: string;
  createdAt: string;
}

export interface FacturaRequest {
  citaId?: string;
  pacienteId: string;
  medicoId: string;
  concepto: string;
  montoSubtotal: number;
  montoImpuesto?: number;
  montoTotal?: number;
  metodoPago?: string;
}

export interface Receta {
  id: string;
  citaId?: string;
  pacienteId: string;
  medicoId: string;
  medicamentos: string;
  indicacionesGenerales?: string;
  firmaDigital: string;
  fechaEmision: string;
  createdAt?: string;
}

export interface RecetaRequest {
  citaId?: string;
  pacienteId: string;
  medicoId: string;
  medicamentos: string;
  indicacionesGenerales?: string;
  fechaEmision?: string;
}

export interface HistorialEvento {
  fecha: string;
  titulo: string;
  descripcion: string;
  isRecent?: boolean;
}

export interface HistorialClinico {
  pacienteNombre: string;
  tipoSangre: string;
  alergias: string;
  peso: string;
  eventos: HistorialEvento[];
}

export interface RecetaData {
  paciente: string;
  edad: string;
  fecha: string;
  medicamentos: string;
  medicoNombre: string;
  medicoEspecialidad: string;
  medicoExeq: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

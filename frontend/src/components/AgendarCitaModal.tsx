import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Stethoscope, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { ApiService } from '../services/api';
import { Cita, CitaRequest, Paciente, Medico, EstadoCita } from '../types';

interface AgendarCitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  medicos: Medico[];
  onCitaAgendada: (cita: Cita) => void;
  cita?: Cita | null;
}

export const AgendarCitaModal: React.FC<AgendarCitaModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  medicos,
  onCitaAgendada,
  cita = null,
}) => {
  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id || '');
  const [medicoId, setMedicoId] = useState(medicos[0]?.id || '');

  useEffect(() => {
    if (pacientes.length > 0 && !pacienteId) {
      setPacienteId(pacientes[0].id);
    }
  }, [pacientes, pacienteId]);

  useEffect(() => {
    if (medicos.length > 0 && !medicoId) {
      setMedicoId(medicos[0].id);
    }
  }, [medicos, medicoId]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [fecha, setFecha] = useState(defaultDateStr);
  const [hora, setHora] = useState('10:00');
  const [motivoConsulta, setMotivoConsulta] = useState('Consulta médica de control');
  const [estado, setEstado] = useState<EstadoCita>('CONFIRMADA');
  const [loading, setLoading] = useState(false);

  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCita, setSuccessCita] = useState<Cita | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (cita) {
      const date = new Date(cita.fechaHora);
      setPacienteId(cita.pacienteId);
      setMedicoId(cita.medicoId);
      setFecha(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
      setHora(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`);
      setMotivoConsulta(cita.motivoConsulta);
      setEstado(cita.estado);
    } else {
      if (pacientes[0]) setPacienteId(pacientes[0].id);
      if (medicos[0]) setMedicoId(medicos[0].id);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFecha(`${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`);
      setHora('10:00');
      setMotivoConsulta('Consulta médica de control');
      setEstado('CONFIRMADA');
    }
    setErrorStatus(null);
    setErrorMessage(null);
    setSuccessCita(null);
  }, [isOpen, cita, pacientes, medicos]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !medicoId) {
      setErrorMessage('Seleccione un paciente y un médico.');
      return;
    }

    setLoading(true);
    setErrorStatus(null);
    setErrorMessage(null);
    setSuccessCita(null);

    const isoDateTime = new Date(`${fecha}T${hora}:00`).toISOString();

    const request: CitaRequest = {
      pacienteId,
      medicoId,
      fechaHora: isoDateTime,
      motivoConsulta,
    };

    try {
      const savedCita = cita
        ? await ApiService.actualizarCita(cita.id, { ...request, estado })
        : await ApiService.agendarCita(request);
      setSuccessCita(savedCita);
      onCitaAgendada(savedCita);
    } catch (err: any) {
      if (err.response || err.status) {
        const status = err.response?.status || err.status;
        setErrorStatus(status);
        const serverMsg = err.response?.data?.message || err.message || 'Error al procesar la solicitud.';
        setErrorMessage(serverMsg);
      } else {
        setErrorStatus(null);
        setErrorMessage(err.message || 'No se pudo guardar la cita localmente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setErrorStatus(null);
    setErrorMessage(null);
    setSuccessCita(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 no-print animate-fade-in">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{cita ? 'Editar Cita Médica' : 'Agendar Cita Médica'}</h3>
              <p className="text-xs text-slate-500">Los datos se guardan en este navegador.</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notificación de Éxito */}
        {successCita ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{cita ? '¡Cita actualizada!' : '¡Cita guardada!'}</h4>
              <p className="text-xs text-slate-500 mt-1">La información quedó guardada en este navegador.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 text-left text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">ID Cita:</span>
                <span className="font-mono text-slate-800 font-semibold">{successCita.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Horario:</span>
                <span className="font-medium text-slate-800">
                  {new Date(successCita.fechaHora).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {successCita.estado}
                </span>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs cursor-pointer"
            >
              Cerrar y Continuar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Alerta 409 Double Booking */}
            {errorStatus === 409 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-900 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Bloqueo de Concurrencia (HTTP 409)</span>
                  <p className="mt-0.5">{errorMessage}</p>
                  <p className="mt-1 text-amber-700">
                    💡 <em>Ya existe una cita para este médico y horario guardada localmente.</em>
                  </p>
                </div>
              </div>
            )}

            {/* Alerta 429 Rate Limiter */}
            {errorStatus === 429 && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm">Límite Excedido</span>
                  <p className="mt-0.5">No se pudo guardar la cita por el límite de solicitudes.</p>
                </div>
              </div>
            )}

            {errorMessage && errorStatus !== 409 && errorStatus !== 429 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{errorMessage}</div>
            )}

            {/* Selector de Paciente */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>Paciente</span>
              </label>
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.documento || p.codigo})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Médico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                <Stethoscope className="w-3.5 h-3.5 text-brand-600" />
                <span>Médico y Consultorio</span>
              </label>
              <select
                value={medicoId}
                onChange={(e) => setMedicoId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} - {m.especialidad} ({m.consultorio || 'Consultorio General'})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  <span>Fecha</span>
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Horario</span>
                </label>
                <select
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:15">11:15 AM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            {/* Motivo de Consulta */}
            {cita && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoCita)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                  {['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA'].map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </div>
            )}
            {/* Motivo de Consulta */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Motivo de Consulta
              </label>
              <textarea
                value={motivoConsulta}
                onChange={(e) => setMotivoConsulta(e.target.value)}
                rows={2}
                maxLength={255}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                placeholder="Indique los síntomas o motivo"
                required
              />
            </div>

            {/* Botones */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-1/3 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Agendando...</span>
                  </>
                ) : (
                  <span>{cita ? 'Guardar Cambios' : 'Confirmar Cita'}</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

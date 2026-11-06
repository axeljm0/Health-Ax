import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Cita, Medico, Paciente } from '../types';
import { MEDICOS_MEDICORE, PACIENTES_MEDICORE } from '../services/api';

interface CitasListProps {
  citas: Cita[];
  loading: boolean;
  onRefresh: () => void;
}

export const CitasList: React.FC<CitasListProps> = ({ citas, loading, onRefresh }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');

  const getMedicoInfo = (medicoId: string) => {
    return MEDICOS_MEDICORE.find((m: Medico) => m.id === medicoId) || {
      nombre: 'Médico Especialista',
      especialidad: 'Medicina General',
    };
  };

  const getPacienteInfo = (pacienteId: string) => {
    return PACIENTES_MEDICORE.find((p: Paciente) => p.id === pacienteId) || {
      nombre: 'Paciente Registrado',
      documento: 'ID: ' + pacienteId.slice(0, 8),
    };
  };

  const citasFiltradas = citas.filter((c) => {
    if (filtroEstado === 'TODAS') return true;
    return c.estado === filtroEstado;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Cabecera de la sección */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Citas Clínicas Agendadas</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {citas.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Citas guardadas en este navegador
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Filtro por Estado */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            {['TODAS', 'CONFIRMADA', 'PENDIENTE'].map((est) => (
              <button
                key={est}
                onClick={() => setFiltroEstado(est)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  filtroEstado === est
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {est === 'TODAS' ? 'Todas' : est.charAt(0) + est.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Botón Refrescar */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Recargar listado"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista / Grid de Citas */}
      {citasFiltradas.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700">No hay citas registradas</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Utiliza el botón superior para agendar una nueva cita médica o prueba el simulador de concurrencia.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {citasFiltradas.map((cita) => {
            const medico = getMedicoInfo(cita.medicoId);
            const paciente = getPacienteInfo(cita.pacienteId);
            const fechaObj = new Date(cita.fechaHora);

            return (
              <div
                key={cita.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Info Médico y Paciente */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{medico.nombre}</h4>
                      <span className="text-[11px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {medico.especialidad}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-700">{paciente.nombre}</span>
                      <span>•</span>
                      <span>Motivo: {cita.motivoConsulta || 'Consulta médica general'}</span>
                    </div>
                  </div>
                </div>

                {/* Fecha y Estado */}
                <div className="flex items-center justify-between md:justify-end space-x-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-health-600" />
                      <span>
                        {fechaObj.toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        -{' '}
                        {fechaObj.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID: {cita.id.slice(0, 13)}...
                    </span>
                  </div>

                  <div>
                    {cita.estado === 'CONFIRMADA' ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmada</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{cita.estado}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

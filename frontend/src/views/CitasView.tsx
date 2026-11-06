import React, { useState } from 'react';
import { Cita, Paciente, Medico } from '../types';
import { Plus, Calendar, Clock, User, Stethoscope, Pencil, Trash2 } from 'lucide-react';

interface CitasViewProps {
  citas: Cita[];
  pacientes: Paciente[];
  medicos: Medico[];
  onOpenAgendar: () => void;
  onEditCita: (cita: Cita) => void;
  onDeleteCita: (citaId: string) => void;
}

export const CitasView: React.FC<CitasViewProps> = ({
  citas,
  pacientes,
  medicos,
  onOpenAgendar,
  onEditCita,
  onDeleteCita,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const getPaciente = (pacienteId: string) => {
    return pacientes.find((p) => p.id === pacienteId) || {
      nombre: `Paciente #${pacienteId.slice(0, 8)}`,
      documento: '',
    };
  };

  const getMedico = (medicoId: string) => {
    return medicos.find((m) => m.id === medicoId) || {
      nombre: `Dr. Adscrito #${medicoId.slice(0, 8)}`,
      especialidad: 'Especialidad',
    };
  };

  // Filter citas by selected date or show all if none match
  const citasFiltradas = citas.filter((c) => {
    if (!selectedDate) return true;
    return c.fechaHora.startsWith(selectedDate);
  });

  const citasAMostrar = citasFiltradas.length > 0 ? citasFiltradas : citas;

  return (
    <section className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Cabecera de la sección */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Calendario de Citas Médicas</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Las citas se conservan localmente y están disponibles al volver a abrir la app
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs font-mono"
              />
            </div>
            <button
              onClick={onOpenAgendar}
              className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-brand-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Nueva Cita</span>
            </button>
          </div>
        </div>

        {/* Lista de Citas */}
        <div className="divide-y divide-slate-100">
          {citasAMostrar.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No hay citas programadas para esta fecha. ¡Agenda una nueva cita médica!
            </div>
          ) : (
            citasAMostrar.map((cita) => {
              const d = new Date(cita.fechaHora);
              const horaFormatted = d.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const fechaFormatted = d.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              const pac = getPaciente(cita.pacienteId);
              const med = getMedico(cita.medicoId);

              return (
                <div
                  key={cita.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/70 transition-colors gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-center sm:w-20 shrink-0">
                      <div className="text-sm font-extrabold text-slate-900 font-mono flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-600" />
                        {horaFormatted}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{fechaFormatted}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {pac.nombre}
                        </span>
                        {pac.documento && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {pac.documento}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        {med.nombre} • <span className="font-medium text-slate-600">{med.especialidad}</span>
                      </p>
                      {cita.motivoConsulta && (
                        <p className="text-[11px] text-slate-500 italic">
                          Motivo: {cita.motivoConsulta}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        cita.estado === 'CONFIRMADA'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : cita.estado === 'PENDIENTE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {cita.estado}
                    </span>
                    <button onClick={() => onEditCita(cita)} title="Editar cita" className="p-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDeleteCita(cita.id)} title="Eliminar cita" className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

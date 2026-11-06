import React from 'react';
import { Cita, TabType, DashboardStats, Paciente, Medico } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  citas: Cita[];
  pacientes: Paciente[];
  medicos: Medico[];
  onSwitchTab: (tab: TabType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  citas,
  pacientes,
  medicos,
  onSwitchTab,
}) => {
  // Helper to find patient name
  const getPacienteName = (pacienteId: string) => {
    const p = pacientes.find((item) => item.id === pacienteId);
    return p ? p.nombre : `Paciente (${pacienteId.slice(0, 8)})`;
  };

  // Helper to find doctor info
  const getMedicoInfo = (medicoId: string) => {
    const m = medicos.find((item) => item.id === medicoId);
    return m ? `${m.especialidad} - ${m.nombre}` : `Médico (${medicoId.slice(0, 8)})`;
  };

  return (
    <section className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Real Dynamic Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pacientes Registrados */}
        <div
          onClick={() => onSwitchTab('pacientes')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center hover:shadow-md hover:border-brand-200 transition-all cursor-pointer group"
        >
          <div className="p-4 bg-blue-50 rounded-xl mr-4 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pacientes Registrados</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.totalPacientes.toLocaleString('es-MX')}
            </h3>
            <p className="text-[11px] text-brand-600 font-medium mt-0.5">Guardados en este navegador</p>
          </div>
        </div>

        {/* Citas Hoy */}
        <div
          onClick={() => onSwitchTab('citas')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="p-4 bg-emerald-50 rounded-xl mr-4 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Citas Hoy</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.citasHoy.toLocaleString('es-MX')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Agenda local</p>
          </div>
        </div>

        {/* Recetas Emitidas */}
        <div
          onClick={() => onSwitchTab('recetas')}
          className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 flex items-center hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="p-4 bg-purple-50 rounded-xl mr-4 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Recetas Emitidas</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats.recetasEmitidas.toLocaleString('es-MX')}
            </h3>
            <p className="text-[11px] text-purple-600 font-medium mt-0.5">Recetas locales imprimibles</p>
          </div>
        </div>
      </div>

      {/* Próximas Citas Reales */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Citas Registradas en el Sistema</h2>
            <p className="text-xs text-slate-500 mt-0.5">Citas guardadas en este navegador</p>
          </div>
          <button
            onClick={() => onSwitchTab('citas')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Ver todas ({citas.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {citas.length === 0 ? (
            <div className="px-6 py-8 text-center text-slate-400 text-xs">
              No hay citas registradas todavía.
            </div>
          ) : (
            citas.slice(0, 5).map((c) => {
              const fecha = new Date(c.fechaHora);
              const pacNombre = getPacienteName(c.pacienteId);
              const medInfo = getMedicoInfo(c.medicoId);

              return (
                <div
                  key={c.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-4 shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{pacNombre}</p>
                      <p className="text-xs text-slate-500">{medInfo}</p>
                      {c.motivoConsulta && (
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-md">
                          Motivo: {c.motivoConsulta}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 text-slate-700">
                      {fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </p>
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

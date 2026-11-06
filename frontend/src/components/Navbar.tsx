import React from 'react';
import { Activity, Plus, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenAgendar: () => void;
  onOpenDevPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAgendar, onOpenDevPanel }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-health-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-health-500/20">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">Health</span>
                <span className="text-xl font-extrabold text-health-600">+</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Reactivo
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Plataforma de Gestión Clínica y Concurrencia</p>
            </div>
          </div>

          {/* Estado del Backend & Acciones */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-medium text-slate-700">Modo local</span>
              <span className="text-slate-300">|</span>
                  <span className="font-medium text-slate-700">Guardado local: Activo</span>
            </div>

            <button
              onClick={onOpenDevPanel}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-sm"
              title="Panel interactivo de pruebas de resiliencia y concurrencia"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulador Arquitectura</span>
            </button>

            <button
              onClick={onOpenAgendar}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-health-600 hover:bg-health-700 rounded-lg shadow-sm shadow-health-600/30 transition-all hover:shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

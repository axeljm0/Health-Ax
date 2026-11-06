import React from 'react';
import { TabType } from '../types';
import { Bell } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
}

const TAB_TITLES: Record<TabType, string> = {
  dashboard: 'Panel General',
  pacientes: 'Gestión de Pacientes',
  medicos: 'Directorio Médico',
  citas: 'Control de Citas',
  recetas: 'Emisión de Recetas Médicas',
  facturas: 'Facturación y Cobranza Médica',
};

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 no-print z-10 sticky top-0 shrink-0">
      <h1 className="text-xl font-bold text-slate-800">
        {TAB_TITLES[currentTab]}
      </h1>

      <div className="flex items-center space-x-4">
        {/* Notificaciones */}
        <button
          className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          title="Notificaciones del sistema"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

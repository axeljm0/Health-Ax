import React from 'react';
import { TabType } from '../types';
import { Receipt, Zap } from 'lucide-react';

interface SidebarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenDevPanel: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  onOpenDevPanel,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col no-print z-20 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <svg
          className="w-8 h-8 text-brand-600 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          ></path>
        </svg>
        <span className="text-xl font-bold tracking-tight text-slate-900">Health+ MediCore</span>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'dashboard'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          Dashboard
        </button>

        {/* Pacientes */}
        <button
          onClick={() => onTabChange('pacientes')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'pacientes'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Pacientes
        </button>

        {/* Médicos */}
        <button
          onClick={() => onTabChange('medicos')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'medicos'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          Médicos
        </button>

        {/* Citas */}
        <button
          onClick={() => onTabChange('citas')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'citas'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          Citas
        </button>

        {/* Recetas */}
        <button
          onClick={() => onTabChange('recetas')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'recetas'
              ? 'bg-brand-50 text-brand-700'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Recetas
        </button>

        {/* Facturación */}
        <button
          onClick={() => onTabChange('facturas')}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
            currentTab === 'facturas'
              ? 'bg-brand-50 text-brand-700 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-5 h-5 mr-3 shrink-0" />
          Facturación
        </button>

        {/* Dev / Stress Panel Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={onOpenDevPanel}
            className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-slate-500 hover:text-brand-600 hover:bg-brand-50/60 rounded-xl transition-colors"
          >
            <Zap className="w-4 h-4 mr-2.5 text-amber-500 shrink-0" />
            Panel de Concurrencia
          </button>
        </div>
      </nav>

      {/* User Profile minimal */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            AD
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium text-slate-900">Dr. Admin</p>
            <p className="text-xs text-slate-500">Director Médico</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

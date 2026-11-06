import React, { useState } from 'react';
import { Medico } from '../types';
import { UserCheck, Plus, Search, ShieldCheck, Pencil, Trash2 } from 'lucide-react';

interface MedicosViewProps {
  medicos: Medico[];
  onOpenNuevoMedico: () => void;
  onEditMedico: (medico: Medico) => void;
  onDeleteMedico: (medicoId: string) => void;
}

export const MedicosView: React.FC<MedicosViewProps> = ({
  medicos,
  onOpenNuevoMedico,
  onEditMedico,
  onDeleteMedico,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const medicosFiltrados = medicos.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.licenciaMedica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (nombre: string) => {
    return nombre
      .split(' ')
      .filter((part) => !['Dr.', 'Dra.'].includes(part))
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'DR';
  };

  return (
    <section className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por médico o especialidad..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs transition-shadow"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <button
          onClick={onOpenNuevoMedico}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nuevo Médico
        </button>
      </div>

      {/* Grid of Doctors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicosFiltrados.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No se encontraron médicos registrados con ese filtro.
          </div>
        ) : (
          medicosFiltrados.map((medico) => (
            <div
              key={medico.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 text-center hover:shadow-md hover:border-brand-300 transition-all group"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 border-2 border-brand-100 bg-brand-50 text-brand-600 font-bold text-xl flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors shadow-xs">
                {medico.avatarText || getInitials(medico.nombre)}
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {medico.nombre}
              </h3>
              <p className="text-brand-600 text-xs font-semibold mt-0.5 mb-2">{medico.especialidad}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-slate-100 text-slate-600 mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {medico.licenciaMedica}
              </div>

              <div className="flex justify-center items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                  {medico.diasAtencion || 'Lun-Vie'}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                  <UserCheck className="w-3 h-3 mr-1" />
                  {medico.activo !== false ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button onClick={() => onEditMedico(medico)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg">
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => onDeleteMedico(medico.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

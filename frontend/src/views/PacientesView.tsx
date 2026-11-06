import React, { useState } from 'react';
import { Paciente } from '../types';
import { UserPlus, Search, FileText, Pencil, Trash2 } from 'lucide-react';

interface PacientesViewProps {
  pacientes: Paciente[];
  onOpenNuevoPaciente: () => void;
  onOpenHistorial: (pacienteNombre: string) => void;
  onEditPaciente: (paciente: Paciente) => void;
  onDeletePaciente: (pacienteId: string) => void;
}

export const PacientesView: React.FC<PacientesViewProps> = ({
  pacientes,
  onOpenNuevoPaciente,
  onOpenHistorial,
  onEditPaciente,
  onDeletePaciente,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const pacientesFiltrados = pacientes.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.documento && p.documento.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.correo && p.correo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.telefono && p.telefono.includes(searchTerm))
  );

  return (
    <section className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, documento o teléfono..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs transition-shadow"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <button
          onClick={onOpenNuevoPaciente}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm shadow-brand-500/20 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Paciente
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4 font-semibold">Documento / ID</th>
                <th className="px-6 py-4 font-semibold">Nombre del Paciente</th>
                <th className="px-6 py-4 font-semibold">Correo Electrónico</th>
                <th className="px-6 py-4 font-semibold">Teléfono</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {pacientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No se encontraron pacientes registrados con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((paciente) => (
                  <tr key={paciente.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                      {paciente.documento || paciente.codigo || `#${paciente.id.slice(0, 8)}`}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 text-sm">{paciente.nombre}</p>
                      <p className="text-[11px] text-slate-400">
                        {paciente.edad ? `${paciente.edad} • Sexo: ${paciente.sexo || 'N/A'}` : 'Expediente Activo'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-[11px]">
                      {paciente.correo}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{paciente.telefono}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onOpenHistorial(paciente.nombre)}
                        className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Ver Historial
                      </button>
                      <button onClick={() => onEditPaciente(paciente)} title="Editar paciente" className="inline-flex items-center p-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDeletePaciente(paciente.id)} title="Eliminar paciente" className="inline-flex items-center p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

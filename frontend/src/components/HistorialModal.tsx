import React from 'react';
import { HistorialClinico } from '../types';

interface HistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  historial: HistorialClinico | null;
}

export const HistorialModal: React.FC<HistorialModalProps> = ({ isOpen, onClose, historial }) => {
  if (!isOpen || !historial) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Historial Clínico</h3>
            <p className="text-sm text-slate-500">
              Paciente: <span className="font-medium text-slate-800">{historial.pacienteNombre}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Contenido / Timeline */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {historial.eventos.map((evento, idx) => (
            <div
              key={idx}
              className={`relative pl-6 border-l-2 ${
                evento.isRecent ? 'border-brand-100' : 'border-slate-100'
              }`}
            >
              <div
                className={`absolute w-3 h-3 rounded-full -left-[7px] top-1 border-2 border-white ${
                  evento.isRecent ? 'bg-brand-500' : 'bg-slate-300'
                }`}
              ></div>
              <p
                className={`text-xs font-semibold mb-1 ${
                  evento.isRecent ? 'text-brand-600' : 'text-slate-500'
                }`}
              >
                {evento.fecha}
              </p>
              <h4 className="text-sm font-bold text-slate-800">{evento.titulo}</h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{evento.descripcion}</p>
            </div>
          ))}

          {/* Vitals Summary */}
          <div className="bg-slate-50 rounded-xl p-4 mt-4 grid grid-cols-3 gap-4 border border-slate-100">
            <div>
              <p className="text-xs text-slate-500">Tipo de Sangre</p>
              <p className="font-semibold text-slate-800">{historial.tipoSangre}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Alergias</p>
              <p className="font-semibold text-slate-800">{historial.alergias}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Peso Registrado</p>
              <p className="font-semibold text-slate-800">{historial.peso}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

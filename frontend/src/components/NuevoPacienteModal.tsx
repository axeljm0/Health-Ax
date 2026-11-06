import React, { useEffect, useState } from 'react';
import { X, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';
import { Paciente } from '../types';

interface NuevoPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPacienteCreado: (paciente: Paciente) => void;
  paciente?: Paciente | null;
}

export const NuevoPacienteModal: React.FC<NuevoPacienteModalProps> = ({
  isOpen,
  onClose,
  onPacienteCreado,
  paciente = null,
}) => {
  const [documento, setDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDocumento(paciente?.documento || '');
    setNombre(paciente?.nombre || '');
    setCorreo(paciente?.correo || '');
    setTelefono(paciente?.telefono || '');
    setError(null);
    setSuccess(false);
  }, [isOpen, paciente]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const request = {
        documento: documento.trim(),
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        telefono: telefono.trim(),
      };
      const nuevo = paciente
        ? await ApiService.actualizarPaciente(paciente.id, request)
        : await ApiService.crearPaciente(request);
      setSuccess(true);
      setTimeout(() => {
        onPacienteCreado(nuevo);
        handleClose();
      }, 700);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'No se pudo guardar el paciente.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDocumento('');
    setNombre('');
    setCorreo('');
    setTelefono('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{paciente ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}</h3>
              <p className="text-xs text-slate-500">Los datos se guardan en este navegador.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">No fue posible registrar</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <p className="font-medium">¡Paciente guardado correctamente!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Documento de Identidad / CURP / DNI
            </label>
            <input
              type="text"
              required
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="Ej. MEX-77492014"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Gabriela Fernández Rivas"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="gabriela@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+52 55 9988 7766"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {paciente ? 'Guardar Cambios' : 'Guardar Paciente'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

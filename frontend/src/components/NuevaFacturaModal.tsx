import React, { useEffect, useState } from 'react';
import { X, Receipt, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ApiService } from '../services/api';
import { Paciente, Medico, Factura } from '../types';

interface NuevaFacturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pacientes: Paciente[];
  medicos: Medico[];
  onFacturaCreada: (factura: Factura) => void;
  factura?: Factura | null;
}

export const NuevaFacturaModal: React.FC<NuevaFacturaModalProps> = ({
  isOpen,
  onClose,
  pacientes,
  medicos,
  onFacturaCreada,
  factura = null,
}) => {
  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id || '');
  const [medicoId, setMedicoId] = useState(medicos[0]?.id || '');
  const [concepto, setConcepto] = useState('Consulta Médica Especializada');
  const [montoSubtotal, setMontoSubtotal] = useState('1200.00');
  const [metodoPago, setMetodoPago] = useState('TARJETA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPacienteId(factura?.pacienteId || pacientes[0]?.id || '');
    setMedicoId(factura?.medicoId || medicos[0]?.id || '');
    setConcepto(factura?.concepto || 'Consulta Médica Especializada');
    setMontoSubtotal(String(factura?.montoSubtotal ?? '1200.00'));
    setMetodoPago(factura?.metodoPago || 'TARJETA');
    setError(null);
    setSuccess(false);
  }, [isOpen, factura, pacientes, medicos]);

  if (!isOpen) return null;

  const subtotalNum = parseFloat(montoSubtotal) || 0;
  const impuestoNum = Number((subtotalNum * 0.16).toFixed(2));
  const totalNum = Number((subtotalNum + impuestoNum).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !medicoId) {
      setError('Debe seleccionar un paciente y un médico.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const request = {
        pacienteId,
        medicoId,
        concepto: concepto.trim(),
        montoSubtotal: subtotalNum,
        montoImpuesto: impuestoNum,
        montoTotal: totalNum,
        metodoPago,
      };
      const nueva = factura
        ? await ApiService.actualizarFactura(factura.id, request)
        : await ApiService.crearFactura(request);

      setSuccess(true);
      setTimeout(() => {
        onFacturaCreada(nueva);
        handleClose();
      }, 700);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'No se pudo guardar la factura.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{factura ? 'Editar Factura Médica' : 'Emitir Factura Médica'}</h3>
              <p className="text-xs text-slate-500">Registro fiscal y contable con cálculo automático de IVA</p>
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
              <p className="font-semibold">Error al emitir factura</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <p className="font-medium">¡Factura guardada correctamente!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Paciente Receptor
              </label>
              <select
                required
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.documento})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Médico Emisor
              </label>
              <select
                required
                value={medicoId}
                onChange={(e) => setMedicoId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white"
              >
                {medicos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} - {m.especialidad}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Concepto / Descripción del Servicio
            </label>
            <input
              type="text"
              required
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Consulta Cardiológica + EKG de esfuerzo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Monto Subtotal ($ MXN)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={montoSubtotal}
                onChange={(e) => setMontoSubtotal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-white"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta de Débito / Crédito</option>
                <option value="TRANSFERENCIA">Transferencia SPEI / Bancaria</option>
                <option value="SEGURO_MEDICO">Seguro Médico / Cobertura</option>
              </select>
            </div>
          </div>

          {/* Desglose de totales */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">${subtotalNum.toFixed(2)} MXN</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (16%):</span>
              <span className="font-mono font-medium">${impuestoNum.toFixed(2)} MXN</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-200">
              <span>Total Facturado:</span>
              <span className="font-mono text-emerald-600">${totalNum.toFixed(2)} MXN</span>
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Emitiendo...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  {factura ? 'Guardar Cambios' : 'Emitir Factura'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Zap, ShieldAlert, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CitaService, MEDICOS_MEDICORE, PACIENTES_MEDICORE } from '../services/api';
import { CitaRequest } from '../types';

interface DevStressPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCitaAgendada: () => void;
}

export const DevStressPanel: React.FC<DevStressPanelProps> = ({ isOpen, onClose, onCitaAgendada }) => {
  const [loadingConcurrency, setLoadingConcurrency] = useState(false);
  const [concurrencyResult, setConcurrencyResult] = useState<{
    req1: { status: number; ok: boolean; message: string };
    req2: { status: number; ok: boolean; message: string };
  } | null>(null);

  const [loadingRateLimit, setLoadingRateLimit] = useState(false);
  const [rateLimitResult, setRateLimitResult] = useState<{
    total: number;
    success: number;
    rateLimited: number;
    other: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleTestDoubleBooking = async () => {
    setLoadingConcurrency(true);
    setConcurrencyResult(null);

    // Slot horario único para este test
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const isoDateTime = `${targetDate.toISOString().split('T')[0]}T14:30:00Z`;

    const request: CitaRequest = {
      pacienteId: PACIENTES_MEDICORE[0].id,
      medicoId: MEDICOS_MEDICORE[0].id,
      fechaHora: isoDateTime,
      motivoConsulta: 'Test concurrente de alta disponibilidad',
    };

    try {
      const [res1, res2] = await CitaService.simularDobleReserva(request);

      setConcurrencyResult({
        req1: {
          status: res1.status,
          ok: res1.ok,
          message: res1.ok ? 'Cita guardada en el almacenamiento local' : (res1.data as any)?.message || 'Conflicto',
        },
        req2: {
          status: res2.status,
          ok: res2.ok,
          message: res2.ok ? 'Cita guardada en el almacenamiento local' : (res2.data as any)?.message || 'Conflicto de horario',
        },
      });

      onCitaAgendada();
    } finally {
      setLoadingConcurrency(false);
    }
  };

  const handleTestRateLimit = async () => {
    setLoadingRateLimit(true);
    setRateLimitResult(null);

    try {
      const result = await CitaService.simularRafagaRateLimit(PACIENTES_MEDICORE[0].id, 25);
      setRateLimitResult({
        total: result.total,
        success: result.success,
        rateLimited: result.rateLimited,
        other: result.other,
      });
    } finally {
      setLoadingRateLimit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pruebas del almacenamiento local</h3>
              <p className="text-xs text-slate-300">Comprobaciones de citas en este navegador</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* PRUEBA 1: DOBLE RESERVA LOCAL */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-health-600" />
                <h4 className="text-sm font-bold text-slate-900">1. Detección de doble reserva</h4>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Alta Concurrencia
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Intenta guardar dos citas para el mismo médico y horario. La segunda debe rechazarse con un conflicto local.
            </p>

            <button
              onClick={handleTestDoubleBooking}
              disabled={loadingConcurrency}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg shadow-sm transition-all flex items-center space-x-2"
            >
              {loadingConcurrency ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Disparando Peticiones Simultáneas...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simular 2 Reservas Concurrentes</span>
                </>
              )}
            </button>

            {concurrencyResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Petición 1 */}
                <div className={`p-3 rounded-lg border text-xs ${concurrencyResult.req1.ok ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Petición A</span>
                    <span className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] shadow-2xs">
                      {concurrencyResult.req1.status === 201 ? 'GUARDADA' : 'CONFLICTO'}
                    </span>
                  </div>
                  <p className="text-[11px]">{concurrencyResult.req1.message}</p>
                </div>

                {/* Petición 2 */}
                <div className={`p-3 rounded-lg border text-xs ${!concurrencyResult.req2.ok ? 'bg-amber-50/80 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span>Petición B</span>
                    <span className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] shadow-2xs">
                      {concurrencyResult.req2.status === 201 ? 'GUARDADA' : 'CONFLICTO'}
                    </span>
                  </div>
                  <p className="text-[11px]">{concurrencyResult.req2.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* PRUEBA 2: LECTURAS LOCALES */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="text-sm font-bold text-slate-900">2. Lecturas de citas</h4>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Local
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lee la lista de citas <strong>25 veces</strong> desde el almacenamiento local. Esta comprobación no depende del API Gateway.
            </p>

            <button
              onClick={handleTestRateLimit}
              disabled={loadingRateLimit}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 rounded-lg shadow-sm transition-all flex items-center space-x-2"
            >
              {loadingRateLimit ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Leyendo citas...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Probar lecturas locales</span>
                </>
              )}
            </button>

            {rateLimitResult && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Resultado de la Ráfaga:</span>
                  <span>{rateLimitResult.total} Peticiones Totales</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="block text-slate-500 text-[10px]">Lecturas correctas</span>
                      <span className="text-lg font-bold">{rateLimitResult.success}</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-900 flex items-center justify-between">
                    <div>
                      <span className="block text-slate-500 text-[10px]">Errores</span>
                      <span className="text-lg font-bold">{rateLimitResult.rateLimited}</span>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};

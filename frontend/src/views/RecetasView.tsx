import React, { useEffect, useState } from 'react';
import { Paciente, Medico, Receta } from '../types';
import { ApiService } from '../services/api';
import { Printer, Save, CheckCircle, AlertCircle, Loader2, FileText, Pencil, Trash2, Plus } from 'lucide-react';

interface RecetasViewProps {
  pacientes: Paciente[];
  medicos: Medico[];
  onRecetaCreada?: () => void;
}

export const RecetasView: React.FC<RecetasViewProps> = ({
  pacientes,
  medicos,
  onRecetaCreada,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedPacienteId, setSelectedPacienteId] = useState(pacientes[0]?.id || '');
  const [selectedMedicoId, setSelectedMedicoId] = useState(medicos[0]?.id || '');
  const [fecha, setFecha] = useState(todayStr);
  const [medicamentos, setMedicamentos] = useState(
    '1. Losartán Potásico 50mg - Tomar 1 tableta cada 24 horas por la mañana en ayunas.\n2. Hidroclorotiazida 12.5mg - Tomar 1 tableta diaria con el desayuno.\n3. Dieta hiposódica y control de presión arterial cada 3 días.'
  );
  const [indicaciones, setIndicaciones] = useState('Mantener reposo relativo y seguimiento en 15 días.');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [selectedRecetaId, setSelectedRecetaId] = useState('');

  const refreshRecetas = async () => setRecetas(await ApiService.getRecetas());
  useEffect(() => { void refreshRecetas(); }, []);
  useEffect(() => {
    if (!selectedPacienteId && pacientes[0]) setSelectedPacienteId(pacientes[0].id);
    if (!selectedMedicoId && medicos[0]) setSelectedMedicoId(medicos[0].id);
  }, [pacientes, medicos, selectedPacienteId, selectedMedicoId]);

  const currentPaciente = pacientes.find((p) => p.id === selectedPacienteId) || pacientes[0];
  const currentMedico = medicos.find((m) => m.id === selectedMedicoId) || medicos[0];

  // Formato DD/MM/YYYY para la previsualización
  const formatDatePreview = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleGuardarReceta = async () => {
    if (!selectedPacienteId || !selectedMedicoId) {
      setError('Seleccione un paciente y un médico.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const request = {
        pacienteId: selectedPacienteId,
        medicoId: selectedMedicoId,
        medicamentos: medicamentos.trim(),
        indicacionesGenerales: indicaciones.trim(),
        fechaEmision: new Date(`${fecha}T12:00:00`).toISOString(),
      };
      const guardada = selectedRecetaId
        ? await ApiService.actualizarReceta(selectedRecetaId, request)
        : await ApiService.crearReceta(request);
      await refreshRecetas();
      setSelectedRecetaId(guardada.id);
      setSavedSuccess(true);
      if (onRecetaCreada) {
        onRecetaCreada();
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'No se pudo guardar la receta.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSeleccionarReceta = (receta: Receta) => {
    setSelectedRecetaId(receta.id);
    setSelectedPacienteId(receta.pacienteId);
    setSelectedMedicoId(receta.medicoId);
    setMedicamentos(receta.medicamentos);
    setIndicaciones(receta.indicacionesGenerales || '');
    setFecha((receta.fechaEmision || receta.createdAt || todayStr).slice(0, 10));
    setSavedSuccess(false);
  };

  const handleNuevaReceta = () => {
    setSelectedRecetaId('');
    setMedicamentos('');
    setIndicaciones('');
    setFecha(todayStr);
    setSavedSuccess(false);
  };

  const handleEliminarReceta = async (id: string) => {
    if (!window.confirm('¿Eliminar esta receta?')) return;
    await ApiService.eliminarReceta(id);
    if (selectedRecetaId === id) handleNuevaReceta();
    await refreshRecetas();
    onRecetaCreada?.();
  };

  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
      {/* Prescription Form (Hidden on Print) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 space-y-4 no-print">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800">Generar y Emitir Receta Médica</h2>
            <p className="text-xs text-slate-500">Se guarda localmente y puedes volver a imprimirla después.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>¡Receta guardada correctamente!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Paciente
            </label>
            <select
              value={selectedPacienteId}
              onChange={(e) => setSelectedPacienteId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.documento})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Médico que prescribe
            </label>
            <select
              value={selectedMedicoId}
              onChange={(e) => setSelectedMedicoId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            >
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} - {m.especialidad}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Edad / Ref
            </label>
            <input
              type="text"
              readOnly
              value={currentPaciente?.edad || 'Adulto'}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Fecha Emisión
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Medicamentos e Indicaciones (Rp/)
          </label>
          <textarea
            value={medicamentos}
            onChange={(e) => setMedicamentos(e.target.value)}
            rows={5}
            placeholder="1. Paracetamol 500mg, tomar 1 cada 8 horas..."
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none font-mono"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Indicaciones Generales / Observaciones
          </label>
          <input
            type="text"
            value={indicaciones}
            onChange={(e) => setIndicaciones(e.target.value)}
            placeholder="Indicaciones adicionales de reposo o dieta..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
          />
        </div>

        <div className="pt-2 grid grid-cols-2 gap-3">
          <button
            onClick={handleGuardarReceta}
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {selectedRecetaId ? 'Guardar cambios' : 'Guardar receta'}
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Receta</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Recetas guardadas</h2>
            <p className="text-xs text-slate-500">{recetas.length} receta(s) en este navegador</p>
          </div>
          <button onClick={handleNuevaReceta} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg">
            <Plus className="w-3.5 h-3.5" /> Nueva
          </button>
        </div>
        {recetas.length === 0 ? (
          <p className="text-xs text-slate-400 py-5 text-center">Las recetas que guardes aparecerán aquí.</p>
        ) : (
          <div className="space-y-2 max-h-[580px] overflow-y-auto">
            {recetas.map((receta) => {
              const paciente = pacientes.find((p) => p.id === receta.pacienteId);
              return (
                <div key={receta.id} className={`p-3 rounded-xl border ${selectedRecetaId === receta.id ? 'border-brand-300 bg-brand-50/50' : 'border-slate-100'}`}>
                  <button onClick={() => handleSeleccionarReceta(receta)} className="w-full text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800"><FileText className="w-4 h-4 text-brand-600" />{paciente?.nombre || 'Paciente'}<span className="ml-auto text-[10px] text-slate-400">{new Date(receta.fechaEmision).toLocaleDateString('es')}</span></div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{receta.medicamentos}</p>
                  </button>
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => handleSeleccionarReceta(receta)} className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-brand-700 hover:bg-brand-100 rounded"><Pencil className="w-3 h-3" /> Editar / Ver</button>
                    <button onClick={() => void handleEliminarReceta(receta.id)} className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-rose-700 hover:bg-rose-50 rounded"><Trash2 className="w-3 h-3" /> Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Print Preview Container (Visible on screen and on print) */}
      <div
        id="print-area"
        className="bg-white border border-slate-200 rounded-2xl shadow-xs print-border p-8 min-h-[580px] flex flex-col relative overflow-hidden"
      >
        {/* Clinic Header */}
        <div className="text-center border-b-2 border-brand-500 pb-6 mb-6">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clínica MediCore Health+</h1>
          <p className="text-xs text-slate-600 mt-1">Av. Paseo de la Reforma 1820, Ciudad Central</p>
          <p className="text-xs text-slate-500">Tel: +52 (55) 8000-CLINIC | contacto@medicore-health.com</p>
        </div>

        {/* Patient Info */}
        <div className="flex justify-between items-end mb-6 text-xs">
          <div>
            <p>
              <span className="font-bold text-slate-800">Paciente:</span>{' '}
              <span className="text-slate-900 font-semibold border-b border-slate-300 px-2 inline-block min-w-[180px]">
                {currentPaciente?.nombre || 'Paciente'}
              </span>
            </p>
            <p className="mt-2">
              <span className="font-bold text-slate-800">Doc / Edad:</span>{' '}
              <span className="text-slate-700 border-b border-slate-300 px-2 inline-block min-w-[100px] font-mono">
                {currentPaciente?.documento || 'MEX-00000000'} • {currentPaciente?.edad || 'Adulto'}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p>
              <span className="font-bold text-slate-800">Fecha:</span>{' '}
              <span className="text-slate-700 border-b border-slate-300 px-2 inline-block min-w-[110px] font-mono">
                {formatDatePreview(fecha) || '\u00A0'}
              </span>
            </p>
          </div>
        </div>

        {/* Prescription Body */}
        <div className="flex-1">
          <h3 className="text-3xl font-serif font-bold text-brand-600 mb-3 opacity-80 select-none">
            Rp/
          </h3>
          <div className="text-slate-800 whitespace-pre-wrap leading-relaxed text-xs min-h-[160px] font-mono">
            {medicamentos || 'Escriba las indicaciones y fármacos a prescribir...'}
          </div>

          {indicaciones && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
              <span className="font-bold text-slate-800">Indicaciones:</span> {indicaciones}
            </div>
          )}
        </div>

        {/* Doctor Signature */}
        <div className="mt-6 pt-6 text-center w-64 mx-auto">
          <div className="border-t border-slate-800 pt-2">
            <p className="font-bold text-slate-900 text-xs">{currentMedico?.nombre || 'Dr. Médico Adscrito'}</p>
            <p className="text-[11px] text-slate-600">
              {currentMedico?.especialidad || 'Especialista'} - {currentMedico?.licenciaMedica || 'MED-0000'}
            </p>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <svg className="w-96 h-96 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

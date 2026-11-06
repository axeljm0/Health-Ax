import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Printer,
  X,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  CreditCard,
  User,
  Stethoscope,
  ShieldCheck,
  QrCode,
  Pencil,
  Trash2
} from 'lucide-react';
import { Factura, Paciente, Medico } from '../types';

interface FacturasViewProps {
  facturas: Factura[];
  pacientes: Paciente[];
  medicos: Medico[];
  onOpenNuevaFactura: () => void;
  onEditFactura: (factura: Factura) => void;
  onDeleteFactura: (facturaId: string) => void;
}

export const FacturasView: React.FC<FacturasViewProps> = ({
  facturas,
  pacientes,
  medicos,
  onOpenNuevaFactura,
  onEditFactura,
  onDeleteFactura,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  // Helper lookups
  const getPaciente = (pacienteId: string) =>
    pacientes.find((p) => p.id === pacienteId) || {
      nombre: 'Paciente Registrado',
      documento: 'N/A',
      correo: 'contacto@paciente.com',
      telefono: 'N/A',
    };

  const getMedico = (medicoId: string) =>
    medicos.find((m) => m.id === medicoId) || {
      nombre: 'Médico Adscrito',
      especialidad: 'Especialidad Clínica',
      licenciaMedica: 'MED-REG-000',
    };

  const filteredFacturas = facturas.filter((f) => {
    const pac = getPaciente(f.pacienteId);
    const med = getMedico(f.medicoId);
    const term = searchTerm.toLowerCase();
    return (
      f.numeroFactura.toLowerCase().includes(term) ||
      f.concepto.toLowerCase().includes(term) ||
      pac.nombre.toLowerCase().includes(term) ||
      med.nombre.toLowerCase().includes(term)
    );
  });

  const totalFacturado = facturas.reduce((acc, f) => acc + Number(f.montoTotal || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Facturación y Cobranza Médica</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprobantes de pago oficiales, cálculo de IVA y generación de facturas imprimibles.
          </p>
        </div>
        <button
          onClick={onOpenNuevaFactura}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-sm shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Factura
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Facturado</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-slate-400 ml-1.5">MXN</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facturas Emitidas</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{facturas.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado Tributario</p>
            <p className="text-sm font-bold text-emerald-600 mt-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Registro local
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por número de factura, concepto, paciente o médico..."
          className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Folio / Factura</th>
                <th className="py-3.5 px-5">Fecha Emisión</th>
                <th className="py-3.5 px-5">Paciente</th>
                <th className="py-3.5 px-5">Médico</th>
                <th className="py-3.5 px-5">Concepto</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {filteredFacturas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No se encontraron facturas registradas en el sistema.
                  </td>
                </tr>
              ) : (
                filteredFacturas.map((f) => {
                  const pac = getPaciente(f.pacienteId);
                  const med = getMedico(f.medicoId);
                  const fechaStr = f.createdAt
                    ? new Date(f.createdAt).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Reciente';

                  return (
                    <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-800">
                        {f.numeroFactura}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">{fechaStr}</td>
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-800">{pac.nombre}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{pac.documento}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-medium text-slate-700">{med.nombre}</div>
                        <div className="text-[10px] text-slate-400">{med.especialidad}</div>
                      </td>
                      <td className="py-3.5 px-5 max-w-xs truncate text-slate-700">{f.concepto}</td>
                      <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                        ${Number(f.montoTotal).toFixed(2)} MXN
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {f.estado || 'PAGADA'}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedFactura(f)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Ver / Imprimir
                        </button>
                        <button onClick={() => onEditFactura(f)} title="Editar factura" className="ml-1 inline-flex items-center p-2 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => onDeleteFactura(f.id)} title="Eliminar factura" className="ml-1 inline-flex items-center p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINTABLE INVOICE MODAL */}
      {selectedFactura && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-100 my-8">
            {/* Action Bar (Hidden during printing) */}
            <div className="print:hidden flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Vista Previa de Comprobante Fiscal
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Factura
                </button>
                <button
                  onClick={() => setSelectedFactura(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINT AREA TARGET */}
            <div id="print-area" className="text-slate-800 space-y-6">
              {/* Factura Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg">
                      +
                    </div>
                    <div>
                      <h1 className="text-xl font-black text-slate-900 tracking-tight">Health+ MediCore</h1>
                      <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                        Red Hospitalaria y de Especialidades Clínicas S.A. de C.V.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                    <p>RFC: HMC-240101-9X8</p>
                    <p>Av. Paseo de la Reforma 1820, Piso 14, CDMX</p>
                    <p>Tel: +52 (55) 8000-CLINIC | contacto@medicore-health.com</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider">
                    FACTURA ELECTRÓNICA
                  </div>
                  <p className="text-lg font-black font-mono text-slate-900 mt-2">
                    {selectedFactura.numeroFactura}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedFactura.createdAt
                      ? new Date(selectedFactura.createdAt).toLocaleString('es-MX', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : 'Fecha Actual'}
                  </p>
                </div>
              </div>

              {/* Paciente y Médico Grid */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-brand-600" /> Datos del Paciente / Receptor
                  </p>
                  {(() => {
                    const pac = getPaciente(selectedFactura.pacienteId);
                    return (
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm">{pac.nombre}</p>
                        <p className="text-slate-600 font-mono">ID / Doc: {pac.documento}</p>
                        <p className="text-slate-600">{pac.correo}</p>
                        <p className="text-slate-600">{pac.telefono}</p>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-1.5 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Médico Adscrito / Emisor
                  </p>
                  {(() => {
                    const med = getMedico(selectedFactura.medicoId);
                    return (
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 text-sm">{med.nombre}</p>
                        <p className="text-slate-600">Especialidad: {med.especialidad}</p>
                        <p className="text-slate-600 font-mono">Licencia Médica: {med.licenciaMedica}</p>
                        <p className="text-slate-600 flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-slate-400" /> Método: {selectedFactura.metodoPago}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Tabla de Conceptos */}
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                      <th className="py-2.5 px-4 w-12 text-center">Cant.</th>
                      <th className="py-2.5 px-4">Descripción del Servicio Médico</th>
                      <th className="py-2.5 px-4 text-right w-28">P. Unitario</th>
                      <th className="py-2.5 px-4 text-right w-28">Importe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 text-center font-mono">1</td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {selectedFactura.concepto}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Atención ambulatoria de especialidad - Health+ Hospital Care
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        ${Number(selectedFactura.montoSubtotal).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        ${Number(selectedFactura.montoSubtotal).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totales y Sello Fiscal */}
              <div className="flex justify-between items-start pt-2">
                {/* Sello QR y Certificación */}
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-200 rounded-lg bg-white">
                    <QrCode className="w-14 h-14 text-slate-800" />
                  </div>
                  <div className="text-[10px] text-slate-400 max-w-[240px] space-y-0.5 font-mono">
                    <p className="font-bold text-slate-600">Folio Fiscal SAT:</p>
                    <p className="break-all">{selectedFactura.id}</p>
                    <p>Certificado: 00001000000508821944</p>
                    <p className="text-emerald-600 font-semibold">Estado: Pagada / Comprobada</p>
                  </div>
                </div>

                {/* Desglose Monetario */}
                <div className="w-56 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${Number(selectedFactura.montoSubtotal).toFixed(2)} MXN</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>IVA Trasladado (16%):</span>
                    <span className="font-mono">${Number(selectedFactura.montoImpuesto).toFixed(2)} MXN</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-300">
                    <span>TOTAL:</span>
                    <span className="font-mono text-emerald-700">
                      ${Number(selectedFactura.montoTotal).toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Legal */}
              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
                Este documento es una representación impresa de un Comprobante Fiscal Digital (CFDI) en el marco del sistema Health+ MediCore.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

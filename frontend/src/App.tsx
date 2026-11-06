import React, { useState, useEffect, useCallback } from 'react';
import { TabType, Cita, Paciente, Medico, Factura, DashboardStats, HistorialClinico } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HistorialModal } from './components/HistorialModal';
import { AgendarCitaModal } from './components/AgendarCitaModal';
import { NuevoPacienteModal } from './components/NuevoPacienteModal';
import { NuevoMedicoModal } from './components/NuevoMedicoModal';
import { NuevaFacturaModal } from './components/NuevaFacturaModal';
import { DevStressPanel } from './components/DevStressPanel';
import { DashboardView } from './views/DashboardView';
import { PacientesView } from './views/PacientesView';
import { MedicosView } from './views/MedicosView';
import { CitasView } from './views/CitasView';
import { RecetasView } from './views/RecetasView';
import { FacturasView } from './views/FacturasView';
import { ApiService, HISTORIALES_PREDEFINIDOS } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Datos reactivos de backend
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    citasHoy: 0,
    recetasEmitidas: 0,
    totalMedicos: 0,
  });
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);

  // Estados de modales
  const [historialModalOpen, setHistorialModalOpen] = useState(false);
  const [selectedHistorial, setSelectedHistorial] = useState<HistorialClinico | null>(null);
  const [agendarModalOpen, setAgendarModalOpen] = useState(false);
  const [nuevoPacienteModalOpen, setNuevoPacienteModalOpen] = useState(false);
  const [nuevoMedicoModalOpen, setNuevoMedicoModalOpen] = useState(false);
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<Paciente | null>(null);
  const [medicoEnEdicion, setMedicoEnEdicion] = useState<Medico | null>(null);
  const [citaEnEdicion, setCitaEnEdicion] = useState<Cita | null>(null);
  const [nuevaFacturaModalOpen, setNuevaFacturaModalOpen] = useState(false);
  const [facturaEnEdicion, setFacturaEnEdicion] = useState<Factura | null>(null);
  const [devPanelOpen, setDevPanelOpen] = useState(false);

  // Carga datos del almacenamiento local del navegador.
  const fetchAllData = useCallback(async () => {
    try {
      const [statsData, pacientesData, medicosData, citasData, facturasData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getPacientes(),
        ApiService.getMedicos(),
        ApiService.getCitas(),
        ApiService.getFacturas(),
      ]);

      if (statsData) setStats(statsData);
      if (pacientesData) setPacientes(pacientesData);
      if (medicosData) setMedicos(medicosData);
      if (citasData) setCitas(citasData);
      if (facturasData) setFacturas(facturasData);
    } catch (error) {
      console.warn('No se pudieron cargar los datos locales:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenHistorial = (pacienteNombre: string) => {
    const historial = HISTORIALES_PREDEFINIDOS[pacienteNombre] || {
      pacienteNombre,
      tipoSangre: 'O+',
      alergias: 'Ninguna conocida',
      peso: '70 kg',
      eventos: [
        {
          fecha: 'Hoy',
          titulo: 'Evaluación y Registro en Sistema',
          descripcion: 'Paciente dado de alta en la plataforma hospitalaria Health+ MediCore.',
          isRecent: true,
        },
      ],
    };
    setSelectedHistorial(historial);
    setHistorialModalOpen(true);
  };

  const handlePacienteCreado = (nuevo: Paciente) => {
    const existe = pacientes.some((paciente) => paciente.id === nuevo.id);
    setPacientes((prev) => [nuevo, ...prev.filter((paciente) => paciente.id !== nuevo.id)]);
    if (!existe) setStats((prev) => ({ ...prev, totalPacientes: prev.totalPacientes + 1 }));
    fetchAllData();
  };

  const handlePacienteEliminado = async (id: string) => {
    if (!window.confirm('¿Eliminar este paciente?')) return;
    await ApiService.eliminarPaciente(id);
    setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
    fetchAllData();
  };

  const handleMedicoCreado = (nuevo: Medico) => {
    const existe = medicos.some((medico) => medico.id === nuevo.id);
    setMedicos((prev) => [nuevo, ...prev.filter((medico) => medico.id !== nuevo.id)]);
    if (!existe) setStats((prev) => ({ ...prev, totalMedicos: (prev.totalMedicos || 0) + 1 }));
    fetchAllData();
  };

  const handleMedicoEliminado = async (id: string) => {
    if (!window.confirm('¿Eliminar este médico?')) return;
    await ApiService.eliminarMedico(id);
    setMedicos((prev) => prev.filter((medico) => medico.id !== id));
    fetchAllData();
  };

  const handleCitaAgendada = (nuevaCita?: Cita) => {
    if (nuevaCita) {
      const existe = citas.some((cita) => cita.id === nuevaCita.id);
      setCitas((prev) => [nuevaCita, ...prev.filter((cita) => cita.id !== nuevaCita.id)]);
      if (!existe) setStats((prev) => ({ ...prev, citasHoy: prev.citasHoy + 1 }));
    }
    fetchAllData();
  };

  const handleCitaEliminada = async (id: string) => {
    if (!window.confirm('¿Eliminar esta cita?')) return;
    await ApiService.eliminarCita(id);
    setCitas((prev) => prev.filter((cita) => cita.id !== id));
    fetchAllData();
  };

  const handleFacturaCreada = (nueva: Factura) => {
    setFacturas((prev) => [nueva, ...prev.filter((factura) => factura.id !== nueva.id)]);
    fetchAllData();
  };

  const handleFacturaEliminada = async (id: string) => {
    if (!window.confirm('¿Eliminar esta factura?')) return;
    await ApiService.eliminarFactura(id);
    setFacturas((prev) => prev.filter((factura) => factura.id !== id));
    fetchAllData();
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 bg-slate-50 w-full">
      {/* Sidebar de Navegación Lateral (Oculto en Impresión) */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenDevPanel={() => setDevPanelOpen(true)}
      />

      {/* Área Principal de Trabajo */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 relative">
        {/* Cabecera Superior (Oculta en Impresión) */}
        <Header currentTab={currentTab} />

        {/* Contenedor con Scroll de Vistas */}
        <div className="flex-1 overflow-auto p-8 no-print">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              citas={citas}
              pacientes={pacientes}
              medicos={medicos}
              onSwitchTab={setCurrentTab}
            />
          )}

          {currentTab === 'pacientes' && (
            <PacientesView
              pacientes={pacientes}
              onOpenNuevoPaciente={() => { setPacienteEnEdicion(null); setNuevoPacienteModalOpen(true); }}
              onOpenHistorial={handleOpenHistorial}
              onEditPaciente={(paciente) => { setPacienteEnEdicion(paciente); setNuevoPacienteModalOpen(true); }}
              onDeletePaciente={handlePacienteEliminado}
            />
          )}

          {currentTab === 'medicos' && (
            <MedicosView
              medicos={medicos}
              onOpenNuevoMedico={() => { setMedicoEnEdicion(null); setNuevoMedicoModalOpen(true); }}
              onEditMedico={(medico) => { setMedicoEnEdicion(medico); setNuevoMedicoModalOpen(true); }}
              onDeleteMedico={handleMedicoEliminado}
            />
          )}

          {currentTab === 'citas' && (
            <CitasView
              citas={citas}
              pacientes={pacientes}
              medicos={medicos}
              onOpenAgendar={() => { setCitaEnEdicion(null); setAgendarModalOpen(true); }}
              onEditCita={(cita) => { setCitaEnEdicion(cita); setAgendarModalOpen(true); }}
              onDeleteCita={handleCitaEliminada}
            />
          )}

          {currentTab === 'recetas' && (
            <RecetasView
              pacientes={pacientes}
              medicos={medicos}
              onRecetaCreada={fetchAllData}
            />
          )}

          {currentTab === 'facturas' && (
            <FacturasView
              facturas={facturas}
              pacientes={pacientes}
              medicos={medicos}
              onOpenNuevaFactura={() => { setFacturaEnEdicion(null); setNuevaFacturaModalOpen(true); }}
              onEditFactura={(factura) => { setFacturaEnEdicion(factura); setNuevaFacturaModalOpen(true); }}
              onDeleteFactura={handleFacturaEliminada}
            />
          )}
        </div>
      </main>

      {/* Modal Historial Clínico */}
      <HistorialModal
        isOpen={historialModalOpen}
        onClose={() => setHistorialModalOpen(false)}
        historial={selectedHistorial}
      />

      {/* Modal Agendar Cita */}
      <AgendarCitaModal
        isOpen={agendarModalOpen}
        onClose={() => setAgendarModalOpen(false)}
        pacientes={pacientes}
        medicos={medicos}
        onCitaAgendada={handleCitaAgendada}
        cita={citaEnEdicion}
      />

      {/* Modal Registrar Nuevo Paciente */}
      <NuevoPacienteModal
        isOpen={nuevoPacienteModalOpen}
        onClose={() => setNuevoPacienteModalOpen(false)}
        onPacienteCreado={handlePacienteCreado}
        paciente={pacienteEnEdicion}
      />

      {/* Modal Registrar Nuevo Médico */}
      <NuevoMedicoModal
        isOpen={nuevoMedicoModalOpen}
        onClose={() => setNuevoMedicoModalOpen(false)}
        onMedicoCreado={handleMedicoCreado}
        medico={medicoEnEdicion}
      />

      {/* Modal Emitir Nueva Factura */}
      <NuevaFacturaModal
        isOpen={nuevaFacturaModalOpen}
        onClose={() => setNuevaFacturaModalOpen(false)}
        pacientes={pacientes}
        medicos={medicos}
        onFacturaCreada={handleFacturaCreada}
        factura={facturaEnEdicion}
      />

      {/* Modal Simulador de Concurrencia y Resiliencia */}
      <DevStressPanel
        isOpen={devPanelOpen}
        onClose={() => setDevPanelOpen(false)}
        onCitaAgendada={fetchAllData}
      />
    </div>
  );
};

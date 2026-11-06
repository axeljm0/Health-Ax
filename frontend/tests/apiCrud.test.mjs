import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ApiService, MEDICOS_FALLBACK, PACIENTES_FALLBACK } from '../src/services/api.ts';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

beforeEach(() => { globalThis.localStorage = new MemoryStorage(); });

test('patients and doctors support local create, read, update, and delete', async () => {
  const patient = await ApiService.crearPaciente({ documento: 'TEST-DNI-01', nombre: 'Paciente de prueba', correo: 'test.patient@example.com', telefono: '809-555-0101' });
  assert.ok((await ApiService.getPacientes()).some((item) => item.id === patient.id));
  assert.equal((await ApiService.actualizarPaciente(patient.id, { nombre: 'Paciente editado' })).nombre, 'Paciente editado');
  await ApiService.eliminarPaciente(patient.id);
  assert.ok(!(await ApiService.getPacientes()).some((item) => item.id === patient.id));

  const doctor = await ApiService.crearMedico({ nombre: 'Dra. Prueba', especialidad: 'Medicina General', licenciaMedica: 'TEST-MED-01' });
  assert.ok((await ApiService.getMedicos()).some((item) => item.id === doctor.id));
  assert.equal((await ApiService.actualizarMedico(doctor.id, { especialidad: 'Pediatría' })).especialidad, 'Pediatría');
  await ApiService.eliminarMedico(doctor.id);
  assert.ok(!(await ApiService.getMedicos()).some((item) => item.id === doctor.id));
});

test('appointments detect duplicate slots and support local update and delete', async () => {
  const request = {
    pacienteId: PACIENTES_FALLBACK[0].id,
    medicoId: MEDICOS_FALLBACK[0].id,
    fechaHora: new Date(Date.now() + 20 * 86400000).toISOString(),
    motivoConsulta: 'Prueba local de cita',
  };
  const appointment = await ApiService.agendarCita(request);
  assert.equal((await ApiService.getCitas()).length, 1);
  await assert.rejects(ApiService.agendarCita(request), (error) => error.status === 409);
  assert.equal((await ApiService.actualizarCita(appointment.id, { estado: 'CANCELADA' })).estado, 'CANCELADA');
  await ApiService.eliminarCita(appointment.id);
  assert.deepEqual(await ApiService.getCitas(), []);
});

test('prescriptions and invoices support local create, read, update, and delete', async () => {
  const prescription = await ApiService.crearReceta({ pacienteId: PACIENTES_FALLBACK[0].id, medicoId: MEDICOS_FALLBACK[0].id, medicamentos: 'Paracetamol 500 mg' });
  assert.ok((await ApiService.getRecetas()).some((item) => item.id === prescription.id));
  assert.equal((await ApiService.actualizarReceta(prescription.id, { medicamentos: 'Ibuprofeno 200 mg' })).medicamentos, 'Ibuprofeno 200 mg');
  await ApiService.eliminarReceta(prescription.id);
  assert.deepEqual(await ApiService.getRecetas(), []);

  const invoice = await ApiService.crearFactura({ pacienteId: PACIENTES_FALLBACK[0].id, medicoId: MEDICOS_FALLBACK[0].id, concepto: 'Consulta', montoSubtotal: 100 });
  assert.equal((await ApiService.getFacturas())[0].id, invoice.id);
  assert.equal((await ApiService.actualizarFactura(invoice.id, { concepto: 'Consulta editada' })).concepto, 'Consulta editada');
  await ApiService.eliminarFactura(invoice.id);
  assert.deepEqual(await ApiService.getFacturas(), []);
});

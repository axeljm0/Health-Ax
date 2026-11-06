import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecord, deleteRecord, readCollection, updateRecord, writeCollection } from '../src/services/localStore.js';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

test.beforeEach(() => { globalThis.localStorage = new MemoryStorage(); });

test('uses initial data on first read and persists it across reads', () => {
  assert.deepEqual(readCollection('patients', [{ id: 'seed' }]), [{ id: 'seed' }]);
  assert.deepEqual(readCollection('patients'), [{ id: 'seed' }]);
});

test('creates, updates, and deletes records durably', () => {
  createRecord('patients', { id: 'p1', name: 'Ana' });
  assert.equal(updateRecord('patients', 'p1', { name: 'Ana Ruiz' }).name, 'Ana Ruiz');
  assert.equal(readCollection('patients')[0].name, 'Ana Ruiz');
  assert.equal(deleteRecord('patients', 'p1'), true);
  assert.deepEqual(readCollection('patients'), []);
});

test('keeps collections isolated and recovers from malformed JSON', () => {
  writeCollection('doctors', [{ id: 'd1' }]);
  localStorage.setItem('healthplus:broken', '{');
  assert.deepEqual(readCollection('doctors'), [{ id: 'd1' }]);
  assert.deepEqual(readCollection('broken', [{ id: 'fallback' }]), [{ id: 'fallback' }]);
});

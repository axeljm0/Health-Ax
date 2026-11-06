const STORAGE_PREFIX = 'healthplus:';

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function readCollection(name, initialValue = []) {
  const storage = getStorage();
  if (!storage) return initialValue;

  const key = `${STORAGE_PREFIX}${name}`;
  try {
    const saved = storage.getItem(key);
    if (saved === null) {
      writeCollection(name, initialValue);
      return initialValue;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : initialValue;
  } catch {
    return initialValue;
  }
}

export function writeCollection(name, records) {
  const storage = getStorage();
  if (!storage) return records;
  try {
    storage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(records));
  } catch {
    // Keep the in-memory operation usable when browser storage is unavailable.
  }
  return records;
}

export function createRecord(name, record, initialValue = []) {
  const records = readCollection(name, initialValue);
  const next = [record, ...records.filter((item) => item.id !== record.id)];
  writeCollection(name, next);
  return record;
}

export function updateRecord(name, id, changes, initialValue = []) {
  const records = readCollection(name, initialValue);
  let updated;
  const next = records.map((record) => {
    if (record.id !== id) return record;
    updated = { ...record, ...changes, id, updatedAt: new Date().toISOString() };
    return updated;
  });
  if (updated) writeCollection(name, next);
  return updated;
}

export function deleteRecord(name, id, initialValue = []) {
  const records = readCollection(name, initialValue);
  const next = records.filter((record) => record.id !== id);
  if (next.length === records.length) return false;
  writeCollection(name, next);
  return true;
}

export function readCollection<T>(name: string, initialValue?: T[]): T[];
export function writeCollection<T>(name: string, records: T[]): T[];
export function createRecord<T extends { id: string }>(name: string, record: T, initialValue?: T[]): T;
export function updateRecord<T extends { id: string }>(name: string, id: string, changes: Partial<T>, initialValue?: T[]): T | undefined;
export function deleteRecord<T extends { id: string }>(name: string, id: string, initialValue?: T[]): boolean;

import type { Snapshot } from './types';

const STORAGE_KEY = 'pension-calculator:snapshots';

export function loadSnapshots(): Snapshot[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Snapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(snapshots: Snapshot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch {
    // Storage may be full or unavailable (e.g. Safari private browsing) — snapshots
    // stay in memory for the session even if persistence silently fails.
  }
}

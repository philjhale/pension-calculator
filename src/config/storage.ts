import type { PensionProjectionInputs } from '../calculator/types';

const STORAGE_KEY = 'pension-calculator:inputs';

export function loadInputs(): PensionProjectionInputs | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PensionProjectionInputs;
  } catch {
    return null;
  }
}

export function saveInputs(inputs: PensionProjectionInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {
    // Storage may be full or unavailable (e.g. Safari private browsing) — inputs
    // stay in memory for the session even if persistence silently fails.
  }
}

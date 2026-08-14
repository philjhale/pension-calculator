import type { PensionProjectionInputs } from '../calculator/types';

const STORAGE_KEY = 'pension-calculator:inputs';

const NUMBER_FIELDS = [
  'currentAge',
  'retirementAge',
  'lumpSumPercentage',
  'growthRatePercentage',
  'currentPot',
  'yourContributionPercentage',
  'employerContributionPercentage',
  'salary',
  'inflationRatePercentage',
  'pensionChargesPercentage',
  'annuityRatePercentage',
] as const satisfies readonly (keyof PensionProjectionInputs)[];

function isPensionProjectionInputs(
  value: unknown,
): value is PensionProjectionInputs {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.statePensionEnabled === 'boolean' &&
    NUMBER_FIELDS.every((field) => typeof record[field] === 'number')
  );
}

export function loadInputs(): PensionProjectionInputs | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isPensionProjectionInputs(parsed) ? parsed : null;
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

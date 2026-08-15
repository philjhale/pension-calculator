import { calculatePensionProjection } from '../calculator/calculatePensionProjection';
import type { PensionProjectionInputs } from '../calculator/types';
import type { Snapshot } from './types';

interface PresetCombo {
  name: string;
  growthRatePercentage: number;
  yourContributionPercentage: number;
  employerContributionPercentage: number;
}

const PRESET_COMBOS: PresetCombo[] = [
  {
    name: 'Average',
    growthRatePercentage: 5,
    yourContributionPercentage: 5,
    employerContributionPercentage: 3,
  },
  {
    name: 'High growth',
    growthRatePercentage: 8,
    yourContributionPercentage: 5,
    employerContributionPercentage: 3,
  },
  {
    name: 'Average, higher contributions',
    growthRatePercentage: 5,
    yourContributionPercentage: 8,
    employerContributionPercentage: 5,
  },
  {
    name: 'High growth, higher contributions',
    growthRatePercentage: 8,
    yourContributionPercentage: 8,
    employerContributionPercentage: 5,
  },
];

const PRESET_LUMP_SUM_PERCENTAGES = [0, 10, 25];

export function generatePresetSnapshots(
  baseInputs: PensionProjectionInputs,
  createId: () => string = () => crypto.randomUUID(),
): Snapshot[] {
  const snapshots: Snapshot[] = [];

  for (const combo of PRESET_COMBOS) {
    for (const lumpSumPercentage of PRESET_LUMP_SUM_PERCENTAGES) {
      const inputs: PensionProjectionInputs = {
        ...baseInputs,
        growthRatePercentage: combo.growthRatePercentage,
        yourContributionPercentage: combo.yourContributionPercentage,
        employerContributionPercentage: combo.employerContributionPercentage,
        lumpSumPercentage,
      };
      snapshots.push({
        id: createId(),
        label: `${combo.name}, ${String(lumpSumPercentage)}% lump sum`,
        inputs,
        outputs: calculatePensionProjection(inputs),
      });
    }
  }

  return snapshots;
}

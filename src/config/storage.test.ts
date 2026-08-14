import { beforeEach, describe, expect, it } from 'vitest';
import type { PensionProjectionInputs } from '../calculator/types';
import { loadInputs, saveInputs } from './storage';

const sampleInputs: PensionProjectionInputs = {
  currentAge: 30,
  retirementAge: 68,
  statePensionEnabled: true,
  lumpSumPercentage: 25,
  growthRatePercentage: 5,
  currentPot: 20000,
  yourContributionPercentage: 5,
  employerContributionPercentage: 3,
  salary: 35000,
  inflationRatePercentage: 2.6,
  pensionChargesPercentage: 0.75,
  annuityRatePercentage: 4,
};

beforeEach(() => {
  localStorage.clear();
});

describe('loadInputs', () => {
  it('returns null when nothing has been saved', () => {
    expect(loadInputs()).toBeNull();
  });

  it('returns null when the stored value is corrupt JSON', () => {
    localStorage.setItem('pension-calculator:inputs', 'not json');
    expect(loadInputs()).toBeNull();
  });

  it('round-trips values saved by saveInputs', () => {
    saveInputs(sampleInputs);
    expect(loadInputs()).toEqual(sampleInputs);
  });
});

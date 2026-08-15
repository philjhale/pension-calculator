import { describe, expect, it } from 'vitest';
import { calculatePensionProjection } from '../calculator/calculatePensionProjection';
import type { PensionProjectionInputs } from '../calculator/types';
import { generatePresetSnapshots } from './presets';

const BASE_INPUTS: PensionProjectionInputs = {
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

function makeIdGenerator(): () => string {
  let counter = 0;
  return () => {
    counter += 1;
    return `id-${String(counter)}`;
  };
}

describe('generatePresetSnapshots', () => {
  it('generates exactly 12 snapshots', () => {
    const snapshots = generatePresetSnapshots(BASE_INPUTS, makeIdGenerator());
    expect(snapshots).toHaveLength(12);
  });

  it('generates labels in the specified grouped order', () => {
    const snapshots = generatePresetSnapshots(BASE_INPUTS, makeIdGenerator());
    expect(snapshots.map((snapshot) => snapshot.label)).toEqual([
      'Average, 0% lump sum',
      'Average, 10% lump sum',
      'Average, 25% lump sum',
      'High growth, 0% lump sum',
      'High growth, 10% lump sum',
      'High growth, 25% lump sum',
      'Average, higher contributions, 0% lump sum',
      'Average, higher contributions, 10% lump sum',
      'Average, higher contributions, 25% lump sum',
      'High growth, higher contributions, 0% lump sum',
      'High growth, higher contributions, 10% lump sum',
      'High growth, higher contributions, 25% lump sum',
    ]);
  });

  it('sets growth rate, contribution percentages, and lump sum per the matrix', () => {
    const snapshots = generatePresetSnapshots(BASE_INPUTS, makeIdGenerator());

    const highGrowthHigherContributions25 = snapshots.find(
      (snapshot) => snapshot.label === 'High growth, higher contributions, 25% lump sum',
    );
    expect(highGrowthHigherContributions25?.inputs).toMatchObject({
      growthRatePercentage: 8,
      yourContributionPercentage: 8,
      employerContributionPercentage: 5,
      lumpSumPercentage: 25,
    });

    const average10 = snapshots.find((snapshot) => snapshot.label === 'Average, 10% lump sum');
    expect(average10?.inputs).toMatchObject({
      growthRatePercentage: 5,
      yourContributionPercentage: 5,
      employerContributionPercentage: 3,
      lumpSumPercentage: 10,
    });
  });

  it('holds all non-matrix inputs constant from the base inputs', () => {
    const customBase: PensionProjectionInputs = {
      ...BASE_INPUTS,
      currentAge: 42,
      retirementAge: 60,
      statePensionEnabled: false,
      currentPot: 123456,
      salary: 99000,
      inflationRatePercentage: 3.1,
      pensionChargesPercentage: 1.2,
      annuityRatePercentage: 5,
    };

    const snapshots = generatePresetSnapshots(customBase, makeIdGenerator());

    for (const snapshot of snapshots) {
      expect(snapshot.inputs.currentAge).toBe(42);
      expect(snapshot.inputs.retirementAge).toBe(60);
      expect(snapshot.inputs.statePensionEnabled).toBe(false);
      expect(snapshot.inputs.currentPot).toBe(123456);
      expect(snapshot.inputs.salary).toBe(99000);
      expect(snapshot.inputs.inflationRatePercentage).toBe(3.1);
      expect(snapshot.inputs.pensionChargesPercentage).toBe(1.2);
      expect(snapshot.inputs.annuityRatePercentage).toBe(5);
    }
  });

  it('computes outputs matching calculatePensionProjection for each snapshot', () => {
    const snapshots = generatePresetSnapshots(BASE_INPUTS, makeIdGenerator());

    for (const snapshot of snapshots) {
      expect(snapshot.outputs).toEqual(calculatePensionProjection(snapshot.inputs));
    }
  });

  it('assigns a unique id to every generated snapshot', () => {
    const snapshots = generatePresetSnapshots(BASE_INPUTS, makeIdGenerator());
    const ids = new Set(snapshots.map((snapshot) => snapshot.id));
    expect(ids.size).toBe(12);
  });
});

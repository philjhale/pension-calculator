import { describe, expect, it } from 'vitest';
import { calculatePensionProjection } from './calculatePensionProjection';
import type { PensionProjectionInputs } from './types';

const baseInputs: PensionProjectionInputs = {
  currentAge: 65,
  retirementAge: 65,
  statePensionEnabled: false,
  lumpSumPercentage: 25,
  growthRatePercentage: 5,
  currentPot: 0,
  yourContributionPercentage: 0,
  employerContributionPercentage: 0,
  salary: 0,
  inflationRatePercentage: 2.6,
};

describe('calculatePensionProjection', () => {
  describe('verification fixtures', () => {
    it('matches the Vanguard reference figures for the retirement-income conversion (within 1%)', () => {
      // Vanguard reference: £818,189 pot, 25% lump sum, £24,546/yr personal pension income.
      // Zero years to retirement isolates the lump-sum/annuity conversion from pot growth.
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentPot: 818189,
        lumpSumPercentage: 25,
      });

      expect(outputs.totalPotValue).toBeCloseTo(818189, 0);
      expect(outputs.lumpSumValue).toBeCloseTo(204547.25, -2);
      expect(outputs.incomePerYear).toBeCloseTo(24546, -2);
      expect(Math.abs(outputs.lumpSumValue - 204547.25) / 204547.25).toBeLessThan(0.01);
      expect(Math.abs(outputs.incomePerYear - 24546) / 24546).toBeLessThan(0.01);
    });

    it('matches the MoneyHelper reference State Pension figure (within 1%)', () => {
      // MoneyHelper reference: £12,548/yr State Pension shown at age 68.
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentAge: 65,
        retirementAge: 68,
        statePensionEnabled: true,
        lumpSumPercentage: 0,
        growthRatePercentage: 0,
        currentPot: 0,
        inflationRatePercentage: 0,
      });

      expect(Math.abs(outputs.incomePerYear - 12548) / 12548).toBeLessThan(0.01);
    });
  });

  describe('unit behaviour', () => {
    it('clamps lump sum percentage at 25', () => {
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentPot: 100000,
        lumpSumPercentage: 40,
      });

      expect(outputs.lumpSumValue).toBeCloseTo(25000, 5);
    });

    it('clamps lump sum percentage at 0', () => {
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentPot: 100000,
        lumpSumPercentage: -10,
      });

      expect(outputs.lumpSumValue).toBeCloseTo(0, 5);
    });

    it('adds exactly the State Pension constant when toggled on', () => {
      const withoutStatePension = calculatePensionProjection({
        ...baseInputs,
        currentPot: 100000,
        statePensionEnabled: false,
      });
      const withStatePension = calculatePensionProjection({
        ...baseInputs,
        currentPot: 100000,
        statePensionEnabled: true,
      });

      expect(withStatePension.incomePerYear - withoutStatePension.incomePerYear).toBeCloseTo(
        12548,
        5,
      );
    });

    it('handles zero years to retirement without error', () => {
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentAge: 60,
        retirementAge: 60,
        currentPot: 50000,
      });

      expect(outputs.totalPotValue).toBeCloseTo(50000, 5);
    });

    it('tracks Contribution £ amount with Salary growth year over year', () => {
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentAge: 63,
        retirementAge: 65,
        growthRatePercentage: 0,
        inflationRatePercentage: 10,
        currentPot: 0,
        salary: 100000,
        yourContributionPercentage: 5,
        employerContributionPercentage: 5,
        lumpSumPercentage: 0,
      });

      // year 1: contribution = 10% * 100,000 = 10,000; salary grows to 110,000
      // year 2: contribution = 10% * 110,000 = 11,000; nominal pot = 10,000 + 11,000 = 21,000
      // deflated to today's money at 10% inflation over 2 years: 21,000 / 1.1^2
      expect(outputs.totalPotValue).toBeCloseTo(21000 / 1.1 ** 2, 5);
    });

    it("deflates pot-derived figures to today's money using the inflation rate, but not State Pension", () => {
      // Isolates the deflation step: zero contributions/growth so the nominal pot never
      // changes, only the deflator (1.026^10) shrinks the reported figures.
      const outputs = calculatePensionProjection({
        ...baseInputs,
        currentAge: 55,
        retirementAge: 65,
        growthRatePercentage: 0,
        inflationRatePercentage: 2.6,
        currentPot: 100000,
        lumpSumPercentage: 25,
        statePensionEnabled: true,
      });

      const deflator = 1.026 ** 10;
      expect(outputs.totalPotValue).toBeCloseTo(100000 / deflator, 5);
      expect(outputs.lumpSumValue).toBeCloseTo(25000 / deflator, 5);
      const expectedPotIncome = (75000 * 0.04) / deflator;
      expect(outputs.incomePerYear).toBeCloseTo(expectedPotIncome + 12548, 5);
    });
  });
});

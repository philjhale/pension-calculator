import {
  ANNUITY_RATE,
  MAX_LUMP_SUM_PERCENTAGE,
  MIN_LUMP_SUM_PERCENTAGE,
  STATE_PENSION_ANNUAL,
} from './constants';
import type { PensionProjectionInputs, PensionProjectionOutputs } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculatePensionProjection(
  inputs: PensionProjectionInputs,
): PensionProjectionOutputs {
  const yearsToRetirement = Math.max(inputs.retirementAge - inputs.currentAge, 0);
  const growthRate = inputs.growthRatePercentage / 100;
  const inflationRate = inputs.inflationRatePercentage / 100;
  const chargesRate = inputs.pensionChargesPercentage / 100;
  const contributionRate =
    (inputs.yourContributionPercentage + inputs.employerContributionPercentage) / 100;

  let pot = inputs.currentPot;
  let salary = inputs.salary;

  // Charges are taken off the whole pot at year-end, after that year's growth and
  // contribution — see ADR-0004.
  for (let year = 0; year < yearsToRetirement; year++) {
    const contribution = contributionRate * salary;
    pot = (pot * (1 + growthRate) + contribution) * (1 - chargesRate);
    salary = salary * (1 + inflationRate);
  }

  const lumpSumPercentage = clamp(
    inputs.lumpSumPercentage,
    MIN_LUMP_SUM_PERCENTAGE,
    MAX_LUMP_SUM_PERCENTAGE,
  );
  const lumpSumValueNominal = pot * (lumpSumPercentage / 100);
  const remainingPotNominal = pot - lumpSumValueNominal;
  const potIncomeNominal = remainingPotNominal * ANNUITY_RATE;

  // Deflate pot-derived figures to today's money; see ADR-0003. State Pension is
  // already expressed in today's terms (it's a fixed current-day constant), so it's
  // added after deflation rather than grown and deflated with the pot.
  const deflator = (1 + inflationRate) ** yearsToRetirement;
  const totalPotValue = pot / deflator;
  const lumpSumValue = lumpSumValueNominal / deflator;
  const potIncome = potIncomeNominal / deflator;

  const statePensionIncome = inputs.statePensionEnabled ? STATE_PENSION_ANNUAL : 0;
  const incomePerYear = potIncome + statePensionIncome;

  return {
    totalPotValue,
    lumpSumValue,
    potIncome,
    statePensionIncome,
    incomePerYear,
    incomePerMonth: incomePerYear / 12,
  };
}

export interface PensionProjectionInputs {
  currentAge: number;
  retirementAge: number;
  statePensionEnabled: boolean;
  lumpSumPercentage: number;
  growthRatePercentage: number;
  currentPot: number;
  yourContributionPercentage: number;
  employerContributionPercentage: number;
  salary: number;
  inflationRatePercentage: number;
  pensionChargesPercentage: number;
}

export interface PensionProjectionOutputs {
  totalPotValue: number;
  lumpSumValue: number;
  incomePerYear: number;
  incomePerMonth: number;
}

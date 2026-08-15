import {
  DEFAULT_PENSION_CHARGES_PERCENTAGE,
  MIN_RETIREMENT_AGE,
  STATE_PENSION_ANNUAL,
} from '../calculator/constants';
import { formatCurrency } from '../format';

interface AssumptionsSectionProps {
  annuityRatePercentage: number;
}

export function AssumptionsSection({ annuityRatePercentage }: AssumptionsSectionProps) {
  return (
    <details className="assumptions">
      <summary>Assumptions</summary>
      <ul>
        <li>
          Pot Income is calculated by converting the pot (after the lump sum is taken) at your
          chosen Annuity Rate ({annuityRatePercentage}%, editable), standing in for the price of a
          guaranteed-for-life annuity. Real annuity rates vary by provider and age; different
          reference calculators imply different rates (see ADR-0005).
        </li>
        <li>
          State Pension, if enabled, adds a flat {formatCurrency(STATE_PENSION_ANNUAL)}/yr (the
          current full new State Pension) from your chosen retirement age — there's no separate
          State Pension age modelled.
        </li>
        <li>
          Pension Charges, defaulting to {DEFAULT_PENSION_CHARGES_PERCENTAGE}%/yr but editable,
          are deducted from the whole pot at the end of each year during accumulation, after that
          year&apos;s growth and Contributions are applied. They don&apos;t apply after
          retirement, so they have no effect on Pot Income.
        </li>
        <li>
          Your pot grows at the nominal Growth Rate each year — no inflation adjustment during
          accumulation. At retirement, the Pot Value, Lump Sum, and Pot Income are then converted
          into today&apos;s money using the Inflation Rate, so the figures shown reflect what that
          amount would buy today, not its future face value. State Pension is already shown at
          today&apos;s rate, so it isn&apos;t converted a second time.
        </li>
        <li>
          Your Salary — and therefore your Contributions — increases every year in line with the
          Inflation Rate, modelling a pay rise that keeps pace with prices.
        </li>
        <li>
          No tax is modelled: the Lump Sum is assumed fully tax-free regardless of pot size, and
          Pot Income and State Pension are shown gross of any income tax you&apos;d actually pay
          on them.
        </li>
        <li>
          Contribution and lump sum limits aren&apos;t modelled: there&apos;s no Annual Allowance
          cap on how much you and your employer can pay in, and the Lump Sum isn&apos;t capped
          against the Lump Sum Allowance — only against 25% of the pot.
        </li>
        <li>
          Retirement Age is limited to {MIN_RETIREMENT_AGE} and above, matching the UK&apos;s
          Normal Minimum Pension Age (rising to 57 from April 2028) — the earliest age you can
          normally access a pension.
        </li>
      </ul>
    </details>
  );
}

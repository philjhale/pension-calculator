import { DEFAULT_PENSION_CHARGES_PERCENTAGE, STATE_PENSION_ANNUAL } from '../calculator/constants';
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
          are deducted from the whole pot at the end of each year, after that year&apos;s growth
          and Contributions are applied.
        </li>
        <li>
          Growth Rate is applied as a nominal rate year-on-year, then the Pot Value, Lump Sum,
          and Pot Income are deflated back to today&apos;s money using the Inflation rate, so
          figures are comparable to what your money is worth now. State Pension is already a
          today&apos;s-money figure and isn&apos;t deflated further. Salary (and therefore
          Contributions) grows every year at the Inflation rate.
        </li>
      </ul>
    </details>
  );
}

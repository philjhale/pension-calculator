import { ANNUITY_RATE, STATE_PENSION_ANNUAL } from '../calculator/constants';
import { formatCurrency } from '../format';

export function AssumptionsSection() {
  return (
    <details className="assumptions">
      <summary>Assumptions</summary>
      <ul>
        <li>
          Pot Income is calculated by converting the pot (after the lump sum is taken) at a fixed
          Annuity Rate of {ANNUITY_RATE * 100}%, standing in for the price of a guaranteed-for-life
          annuity.
        </li>
        <li>
          State Pension, if enabled, adds a flat {formatCurrency(STATE_PENSION_ANNUAL)}/yr (the
          current full new State Pension) from your chosen retirement age — there's no separate
          State Pension age modelled.
        </li>
        <li>
          Growth Rate is applied as a nominal rate, with no separate discounting back to
          &quot;today&apos;s money&quot;. Salary (and therefore Contributions) grows every year at
          the Inflation rate instead.
        </li>
      </ul>
    </details>
  );
}

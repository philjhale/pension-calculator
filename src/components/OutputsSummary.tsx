import type { PensionProjectionOutputs } from '../calculator/types';
import { formatCurrency } from '../format';

interface OutputsSummaryProps {
  outputs: PensionProjectionOutputs;
}

export function OutputsSummary({ outputs }: OutputsSummaryProps) {
  return (
    <dl className="outputs">
      <div>
        <dt>Total Pot Value</dt>
        <dd>{formatCurrency(outputs.totalPotValue)}</dd>
      </div>
      <div>
        <dt>Lump Sum</dt>
        <dd>{formatCurrency(outputs.lumpSumValue)}</dd>
      </div>
      <div>
        <dt>Pot Income</dt>
        <dd>{formatCurrency(outputs.potIncome)}</dd>
      </div>
      <div>
        <dt>State Pension Income</dt>
        <dd>{formatCurrency(outputs.statePensionIncome)}</dd>
      </div>
      <div>
        <dt>Income per Year</dt>
        <dd>{formatCurrency(outputs.incomePerYear)}</dd>
      </div>
      <div>
        <dt>Income per Month</dt>
        <dd>{formatCurrency(outputs.incomePerMonth)}</dd>
      </div>
    </dl>
  );
}

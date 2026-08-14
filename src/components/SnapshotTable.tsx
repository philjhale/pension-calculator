import type { Snapshot } from '../snapshot/types';
import { formatCurrency } from '../format';

interface SnapshotTableProps {
  snapshots: Snapshot[];
  onRemove: (id: string) => void;
}

function formatPercentage(value: number): string {
  return `${String(value)}%`;
}

export function SnapshotTable({ snapshots, onRemove }: SnapshotTableProps) {
  if (snapshots.length === 0) {
    return null;
  }

  return (
    <div className="snapshot-table-scroll">
      <table className="snapshot-table">
        <thead>
          <tr>
            <th></th>
            <th colSpan={8}>Configuration</th>
            <th colSpan={5}>Results</th>
            <th></th>
          </tr>
          <tr>
            <th className="col-label">Snapshot</th>
            <th>Ages</th>
            <th>State Pension</th>
            <th>Salary</th>
            <th>Contributions</th>
            <th>Growth Rate</th>
            <th>Inflation</th>
            <th>Charges</th>
            <th>Annuity Rate</th>
            <th>Total Pot Value</th>
            <th>Lump Sum</th>
            <th>Pot Income</th>
            <th>State Pension Income</th>
            <th>Income per Month</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map((snapshot) => (
            <tr key={snapshot.id}>
              <td className="col-label">{snapshot.label}</td>
              <td>
                {snapshot.inputs.currentAge} → {snapshot.inputs.retirementAge}
              </td>
              <td>{snapshot.inputs.statePensionEnabled ? 'Yes' : 'No'}</td>
              <td>{formatCurrency(snapshot.inputs.salary)}</td>
              <td>
                {formatPercentage(snapshot.inputs.yourContributionPercentage)} /{' '}
                {formatPercentage(snapshot.inputs.employerContributionPercentage)}
              </td>
              <td>{formatPercentage(snapshot.inputs.growthRatePercentage)}</td>
              <td>{formatPercentage(snapshot.inputs.inflationRatePercentage)}</td>
              <td>{formatPercentage(snapshot.inputs.pensionChargesPercentage)}</td>
              <td>{formatPercentage(snapshot.inputs.annuityRatePercentage)}</td>
              <td>{formatCurrency(snapshot.outputs.totalPotValue)}</td>
              <td>
                {formatCurrency(snapshot.outputs.lumpSumValue)} (
                {formatPercentage(snapshot.inputs.lumpSumPercentage)})
              </td>
              <td>{formatCurrency(snapshot.outputs.potIncome)}</td>
              <td>{formatCurrency(snapshot.outputs.statePensionIncome)}</td>
              <td>{formatCurrency(snapshot.outputs.incomePerMonth)}</td>
              <td>
                <button
                  type="button"
                  onClick={() => {
                    onRemove(snapshot.id);
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import type { Snapshot } from '../snapshot/types';
import { formatCurrency } from '../format';

interface SnapshotTableProps {
  snapshots: Snapshot[];
  onRemove: (id: string) => void;
}

export function SnapshotTable({ snapshots, onRemove }: SnapshotTableProps) {
  if (snapshots.length === 0) {
    return null;
  }

  return (
    <table className="snapshot-table">
      <thead>
        <tr>
          <th>Snapshot</th>
          <th>Total Pot Value</th>
          <th>Lump Sum</th>
          <th>Pot Income</th>
          <th>State Pension Income</th>
          <th>Income per Year</th>
          <th>Income per Month</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {snapshots.map((snapshot) => (
          <tr key={snapshot.id}>
            <td>{snapshot.label}</td>
            <td>{formatCurrency(snapshot.outputs.totalPotValue)}</td>
            <td>{formatCurrency(snapshot.outputs.lumpSumValue)}</td>
            <td>{formatCurrency(snapshot.outputs.potIncome)}</td>
            <td>{formatCurrency(snapshot.outputs.statePensionIncome)}</td>
            <td>{formatCurrency(snapshot.outputs.incomePerYear)}</td>
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
  );
}

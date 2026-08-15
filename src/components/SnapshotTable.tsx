import { memo, useCallback } from 'react';
import { useDragReorder } from '../hooks/useDragReorder';
import type { Snapshot } from '../snapshot/types';
import { formatCurrency } from '../format';

interface SnapshotTableProps {
  snapshots: Snapshot[];
  onRemove: (id: string) => void;
  onReorder: (snapshots: Snapshot[]) => void;
}

function formatPercentage(value: number): string {
  return `${String(value)}%`;
}

function getSnapshotId(snapshot: Snapshot): string {
  return snapshot.id;
}

interface SnapshotRowProps {
  snapshot: Snapshot;
  isDragging: boolean;
  registerRow: (id: string, row: HTMLElement | null) => void;
  startDrag: (id: string) => void;
  moveItem: (id: string, direction: 'up' | 'down') => void;
  onRemove: (id: string) => void;
}

const SnapshotRow = memo(function SnapshotRow({
  snapshot,
  isDragging,
  registerRow,
  startDrag,
  moveItem,
  onRemove,
}: SnapshotRowProps) {
  const setRowRef = useCallback(
    (row: HTMLTableRowElement | null) => {
      registerRow(snapshot.id, row);
    },
    [registerRow, snapshot.id],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      startDrag(snapshot.id);
    },
    [startDrag, snapshot.id],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
        return;
      }
      event.preventDefault();
      moveItem(snapshot.id, event.key === 'ArrowUp' ? 'up' : 'down');
    },
    [moveItem, snapshot.id],
  );

  const handleRemove = useCallback(() => {
    onRemove(snapshot.id);
  }, [onRemove, snapshot.id]);

  return (
    <tr
      ref={setRowRef}
      className={isDragging ? 'snapshot-row is-dragging' : 'snapshot-row'}
    >
      <td className="col-drag">
        <button
          type="button"
          className="drag-handle"
          aria-label={`Reorder ${snapshot.label}. Use the up and down arrow keys to move.`}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
        >
          <svg viewBox="0 0 12 20" aria-hidden="true">
            <circle cx="4" cy="4" r="1.5" />
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="4" cy="16" r="1.5" />
            <circle cx="8" cy="4" r="1.5" />
            <circle cx="8" cy="10" r="1.5" />
            <circle cx="8" cy="16" r="1.5" />
          </svg>
        </button>
      </td>
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
        <button type="button" onClick={handleRemove}>
          Remove
        </button>
      </td>
    </tr>
  );
});

export function SnapshotTable({
  snapshots,
  onRemove,
  onReorder,
}: SnapshotTableProps) {
  const { draggingId, displayedItems, registerRow, startDrag, moveItem } =
    useDragReorder(snapshots, getSnapshotId, onReorder);

  if (snapshots.length === 0) {
    return null;
  }

  return (
    <div className="snapshot-table-scroll">
      <div className="snapshot-table-scroll-inner">
        <table className="snapshot-table">
          <thead>
            <tr>
              <th className="col-drag"></th>
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
            {displayedItems.map((snapshot) => (
              <SnapshotRow
                key={snapshot.id}
                snapshot={snapshot}
                isDragging={snapshot.id === draggingId}
                registerRow={registerRow}
                startDrag={startDrag}
                moveItem={moveItem}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

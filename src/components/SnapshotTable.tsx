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

interface MetricRow {
  label: string;
  render: (snapshot: Snapshot) => React.ReactNode;
}

const METRIC_ROWS: MetricRow[] = [
  {
    label: 'Ages',
    render: (s) => `${String(s.inputs.currentAge)} → ${String(s.inputs.retirementAge)}`,
  },
  {
    label: 'State Pension',
    render: (s) => (s.inputs.statePensionEnabled ? 'Yes' : 'No'),
  },
  { label: 'Salary', render: (s) => formatCurrency(s.inputs.salary) },
  {
    label: 'Contributions',
    render: (s) =>
      `${formatPercentage(s.inputs.yourContributionPercentage)} / ${formatPercentage(s.inputs.employerContributionPercentage)}`,
  },
  {
    label: 'Growth Rate',
    render: (s) => formatPercentage(s.inputs.growthRatePercentage),
  },
  {
    label: 'Inflation',
    render: (s) => formatPercentage(s.inputs.inflationRatePercentage),
  },
  {
    label: 'Charges',
    render: (s) => formatPercentage(s.inputs.pensionChargesPercentage),
  },
  {
    label: 'Annuity Rate',
    render: (s) => formatPercentage(s.inputs.annuityRatePercentage),
  },
  {
    label: 'Total Pot Value',
    render: (s) => formatCurrency(s.outputs.totalPotValue),
  },
  {
    label: 'Lump Sum',
    render: (s) =>
      `${formatCurrency(s.outputs.lumpSumValue)} (${formatPercentage(s.inputs.lumpSumPercentage)})`,
  },
  { label: 'Pot Income', render: (s) => formatCurrency(s.outputs.potIncome) },
  {
    label: 'State Pension Income',
    render: (s) => formatCurrency(s.outputs.statePensionIncome),
  },
  {
    label: 'Income per Month',
    render: (s) => formatCurrency(s.outputs.incomePerMonth),
  },
];

interface SnapshotColumnHeaderProps {
  snapshot: Snapshot;
  isDragging: boolean;
  registerColumn: (id: string, column: HTMLElement | null) => void;
  startDrag: (id: string) => void;
  moveItem: (id: string, direction: 'previous' | 'next') => void;
  onRemove: (id: string) => void;
}

const SnapshotColumnHeader = memo(function SnapshotColumnHeader({
  snapshot,
  isDragging,
  registerColumn,
  startDrag,
  moveItem,
  onRemove,
}: SnapshotColumnHeaderProps) {
  const setColumnRef = useCallback(
    (column: HTMLTableCellElement | null) => {
      registerColumn(snapshot.id, column);
    },
    [registerColumn, snapshot.id],
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
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      event.preventDefault();
      moveItem(snapshot.id, event.key === 'ArrowLeft' ? 'previous' : 'next');
    },
    [moveItem, snapshot.id],
  );

  const handleRemove = useCallback(() => {
    onRemove(snapshot.id);
  }, [onRemove, snapshot.id]);

  return (
    <th
      ref={setColumnRef}
      className={
        isDragging ? 'snapshot-column is-dragging' : 'snapshot-column'
      }
    >
      <div className="snapshot-column-header">
        <button
          type="button"
          className="drag-handle"
          aria-label={`Reorder ${snapshot.label}. Use the left and right arrow keys to move.`}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
        >
          <svg viewBox="0 0 20 12" aria-hidden="true">
            <circle cx="4" cy="4" r="1.5" />
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="16" cy="4" r="1.5" />
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="10" cy="8" r="1.5" />
            <circle cx="16" cy="8" r="1.5" />
          </svg>
        </button>
        <span className="snapshot-column-label">{snapshot.label}</span>
        <button type="button" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </th>
  );
});

export function SnapshotTable({
  snapshots,
  onRemove,
  onReorder,
}: SnapshotTableProps) {
  const { draggingId, displayedItems, registerRow, startDrag, moveItem } =
    useDragReorder(snapshots, getSnapshotId, onReorder, 'horizontal');

  if (snapshots.length === 0) {
    return null;
  }

  return (
    <div className="snapshot-table-scroll">
      <div className="snapshot-table-scroll-inner">
        <table className="snapshot-table">
          <thead>
            <tr>
              <th className="col-label"></th>
              {displayedItems.map((snapshot) => (
                <SnapshotColumnHeader
                  key={snapshot.id}
                  snapshot={snapshot}
                  isDragging={snapshot.id === draggingId}
                  registerColumn={registerRow}
                  startDrag={startDrag}
                  moveItem={moveItem}
                  onRemove={onRemove}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {METRIC_ROWS.map((row) => (
              <tr key={row.label}>
                <td className="col-label">{row.label}</td>
                {displayedItems.map((snapshot) => (
                  <td key={snapshot.id}>{row.render(snapshot)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { memo, useCallback, useEffect, useRef, useState } from 'react';
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
      <td>
        {formatCurrency(snapshot.outputs.incomePerMonth)} p/m,{' '}
        {formatCurrency(snapshot.outputs.incomePerYear)} p/a
      </td>
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
  const [isExpanded, setIsExpanded] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shouldShowDialog = isExpanded && snapshots.length > 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (shouldShowDialog && !dialog.open) {
      dialog.showModal();
    } else if (!shouldShowDialog && dialog.open) {
      dialog.close();
    }
  }, [shouldShowDialog]);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleDialogClick = useCallback((event: React.MouseEvent) => {
    if (event.target === dialogRef.current) {
      collapse();
    }
  }, [collapse]);

  if (snapshots.length === 0) {
    return null;
  }

  const table = (
    <table className="snapshot-table">
      <thead>
        <tr>
          <th className="col-drag"></th>
          <th className="col-label">Snapshot</th>
          <th>Ages</th>
          <th>State Pension</th>
          <th>Salary (p/a)</th>
          <th>Contributions</th>
          <th>Growth Rate</th>
          <th>Inflation</th>
          <th>Charges</th>
          <th>Annuity Rate</th>
          <th>Total Pot Value</th>
          <th>Lump Sum</th>
          <th>Pot Income (p/a)</th>
          <th>State Pension Income (p/a)</th>
          <th>Gross Income (p/m, p/a)</th>
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
  );

  return (
    <>
      <div className="snapshot-table-scroll">
        <div className="snapshot-table-toolbar">
          <button
            type="button"
            className="expand-button"
            aria-label="Expand snapshot table to full screen"
            onClick={expand}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M1 1h6v1.5H2.5V6H1V1zm14 0v6h-1.5V2.5H10V1h6zM1 15V9h1.5v4.5H6V15H1zm14 0h-6v-1.5h4.5V9H15v6z" />
            </svg>
          </button>
        </div>
        <div className="snapshot-table-scroll-inner">{!shouldShowDialog && table}</div>
      </div>
      <dialog
        ref={dialogRef}
        className="snapshot-table-dialog"
        onClose={collapse}
        onClick={handleDialogClick}
      >
        <div className="snapshot-table-dialog-header">
          <h2>Snapshots</h2>
          <button
            type="button"
            className="expand-button"
            aria-label="Close full screen snapshot table"
            onClick={collapse}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 2.5 8 7l4.5-4.5 1 1L9 8l4.5 4.5-1 1L8 9l-4.5 4.5-1-1L7 8 2.5 3.5z" />
            </svg>
          </button>
        </div>
        <div className="snapshot-table-scroll-inner">{shouldShowDialog && table}</div>
      </dialog>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
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

function moveSnapshot(
  snapshots: Snapshot[],
  fromIndex: number,
  toIndex: number,
): Snapshot[] {
  const reordered = [...snapshots];
  const [moved] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, moved);
  return reordered;
}

export function SnapshotTable({
  snapshots,
  onRemove,
  onReorder,
}: SnapshotTableProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localOrder, setLocalOrder] = useState<Snapshot[] | null>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());

  useEffect(() => {
    if (draggingId === null) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      setLocalOrder((current) => {
        const order = current ?? snapshots;
        const draggedIndex = order.findIndex(
          (snapshot) => snapshot.id === draggingId,
        );
        if (draggedIndex === -1) {
          return current;
        }

        let targetIndex = order.length - 1;
        for (let index = 0; index < order.length; index += 1) {
          const row = rowRefs.current.get(order[index].id);
          if (!row) {
            continue;
          }
          const rect = row.getBoundingClientRect();
          const middle = rect.top + rect.height / 2;
          if (event.clientY < middle) {
            targetIndex = index;
            break;
          }
        }

        if (targetIndex === draggedIndex) {
          return current;
        }

        return moveSnapshot(order, draggedIndex, targetIndex);
      });
    }

    function finishDrag() {
      setDraggingId(null);
      setLocalOrder((current) => {
        if (current) {
          onReorder(current);
        }
        return null;
      });
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [draggingId, snapshots, onReorder]);

  if (snapshots.length === 0) {
    return null;
  }

  const displayedSnapshots = localOrder ?? snapshots;

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
            {displayedSnapshots.map((snapshot) => (
              <tr
                key={snapshot.id}
                ref={(row) => {
                  if (row) {
                    rowRefs.current.set(snapshot.id, row);
                  } else {
                    rowRefs.current.delete(snapshot.id);
                  }
                }}
                className={
                  snapshot.id === draggingId
                    ? 'snapshot-row is-dragging'
                    : 'snapshot-row'
                }
              >
                <td className="col-drag">
                  <button
                    type="button"
                    className="drag-handle"
                    aria-label={`Reorder ${snapshot.label}. Use the up and down arrow keys to move.`}
                    onPointerDown={(event) => {
                      if (event.button !== 0) {
                        return;
                      }
                      event.preventDefault();
                      setDraggingId(snapshot.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                        return;
                      }
                      event.preventDefault();
                      const index = snapshots.findIndex(
                        (item) => item.id === snapshot.id,
                      );
                      const targetIndex =
                        event.key === 'ArrowUp' ? index - 1 : index + 1;
                      if (targetIndex < 0 || targetIndex >= snapshots.length) {
                        return;
                      }
                      onReorder(moveSnapshot(snapshots, index, targetIndex));
                    }}
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
                  {formatPercentage(snapshot.inputs.yourContributionPercentage)}{' '}
                  /{' '}
                  {formatPercentage(
                    snapshot.inputs.employerContributionPercentage,
                  )}
                </td>
                <td>
                  {formatPercentage(snapshot.inputs.growthRatePercentage)}
                </td>
                <td>
                  {formatPercentage(snapshot.inputs.inflationRatePercentage)}
                </td>
                <td>
                  {formatPercentage(snapshot.inputs.pensionChargesPercentage)}
                </td>
                <td>
                  {formatPercentage(snapshot.inputs.annuityRatePercentage)}
                </td>
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
    </div>
  );
}

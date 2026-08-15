import { useCallback, useEffect, useRef, useState } from 'react';

interface DragState<T> {
  id: string;
  order: T[];
}

interface UseDragReorderResult<T> {
  draggingId: string | null;
  displayedItems: T[];
  registerRow: (id: string, row: HTMLElement | null) => void;
  startDrag: (id: string) => void;
  moveItem: (id: string, direction: 'up' | 'down') => void;
}

/**
 * Drag-to-reorder for a list rendered as one row per item, using Pointer
 * Events so both mouse and touch dragging work. `onReorder` is only called
 * once, when the drag ends, not on every pointer move.
 */
export function useDragReorder<T>(
  items: T[],
  getId: (item: T) => string,
  onReorder: (items: T[]) => void,
): UseDragReorderResult<T> {
  const [drag, setDrag] = useState<DragState<T> | null>(null);
  const rowRefs = useRef(new Map<string, HTMLElement>());
  const itemsRef = useRef(items);
  const getIdRef = useRef(getId);
  const onReorderRef = useRef(onReorder);
  const frameRef = useRef<number | null>(null);
  const pendingEventRef = useRef<PointerEvent | null>(null);

  useEffect(() => {
    itemsRef.current = items;
    getIdRef.current = getId;
    onReorderRef.current = onReorder;
  });

  const registerRow = useCallback((id: string, row: HTMLElement | null) => {
    if (row) {
      rowRefs.current.set(id, row);
    } else {
      rowRefs.current.delete(id);
    }
  }, []);

  const startDrag = useCallback((id: string) => {
    setDrag({ id, order: itemsRef.current });
  }, []);

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    const currentItems = itemsRef.current;
    const index = currentItems.findIndex(
      (item) => getIdRef.current(item) === id,
    );
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || targetIndex < 0 || targetIndex >= currentItems.length) {
      return;
    }
    const reordered = [...currentItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorderRef.current(reordered);
  }, []);

  const isDragging = drag !== null;

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    function processMove(event: PointerEvent) {
      setDrag((current) => {
        if (!current) {
          return current;
        }
        const getIdFn = getIdRef.current;
        const draggedIndex = current.order.findIndex(
          (item) => getIdFn(item) === current.id,
        );
        if (draggedIndex === -1) {
          return current;
        }

        const targetIndex = current.order.findIndex((item) => {
          const row = rowRefs.current.get(getIdFn(item));
          if (!row) {
            return false;
          }
          const rect = row.getBoundingClientRect();
          return event.clientY < rect.top + rect.height / 2;
        });
        const resolvedTargetIndex =
          targetIndex === -1 ? current.order.length - 1 : targetIndex;

        if (resolvedTargetIndex === draggedIndex) {
          return current;
        }

        const reordered = [...current.order];
        const [moved] = reordered.splice(draggedIndex, 1);
        reordered.splice(resolvedTargetIndex, 0, moved);
        return { id: current.id, order: reordered };
      });
    }

    function handlePointerMove(event: PointerEvent) {
      pendingEventRef.current = event;
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        if (pendingEventRef.current) {
          processMove(pendingEventRef.current);
        }
      });
    }

    function finishDrag() {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      setDrag((current) => {
        if (current) {
          onReorderRef.current(current.order);
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
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isDragging]);

  return {
    draggingId: drag?.id ?? null,
    displayedItems: drag?.order ?? items,
    registerRow,
    startDrag,
    moveItem,
  };
}

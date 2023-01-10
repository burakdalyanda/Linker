import {DraggableId, DragPreviewRenderer, useDraggable} from './use-draggable';
import {useDroppable} from './use-droppable';
import {RefObject} from 'react';
import {mergeProps} from '@react-aria/utils';
import {moveItemInArray} from '@common/utils/array/move-item-in-array';
import {droppables} from './drag-state';
import {moveItemInNewArray} from '@common/utils/array/move-item-in-new-array';

let sortSession: null | {
  // items in this list will be moved when user is sorting
  sortables: DraggableId[];
  // sortable user started dragging to start this session
  activeSortable: DraggableId;
  activeIndex: number;
  finalIndex: number;
} = null;

export interface UseSortableProps {
  item: DraggableId;
  items: DraggableId[];
  onSortEnd?: (oldIndex: number, newIndex: number) => void;
  ref: RefObject<HTMLElement>;
  type: string;
  preview?: RefObject<DragPreviewRenderer>;
  disabled?: boolean;
}
export function useSortable({
  item,
  items,
  type,
  ref,
  onSortEnd,
  preview,
  disabled,
}: UseSortableProps) {
  const {draggableProps, dragHandleRef} = useDraggable({
    id: item,
    ref,
    type,
    preview,
    disabled,
    onDragStart: () => {
      sortSession = {
        sortables: [...items],
        activeSortable: item,
        activeIndex: items.indexOf(item),
        finalIndex: items.indexOf(item),
      };

      addSortStyles();
    },
    onDragEnd: () => {
      if (!sortSession) return;

      removeSortStyles();
      onSortEnd?.(sortSession.activeIndex, sortSession.finalIndex);
      sortSession = null;
    },
    getData: () => {},
  });

  const {droppableProps} = useDroppable({
    id: item,
    ref,
    types: [type],
    disabled,
    onDragEnter: () => {
      if (!sortSession) return;

      const overIndex = sortSession.sortables.indexOf(item);
      const oldIndex = sortSession.sortables.indexOf(
        sortSession.activeSortable
      );

      moveItemInArray(sortSession.sortables, oldIndex, overIndex);
      const rects = sortSession.sortables.map(s => droppables.get(s)?.rect);

      sortSession.sortables.forEach((sortable, index) => {
        if (!sortSession) return;

        const newRects = moveItemInNewArray(
          rects,
          overIndex,
          sortSession.activeIndex
        );
        const oldRect = rects[index];
        const newRect = newRects[index];
        const sortableTarget = droppables.get(sortable);

        if (sortableTarget?.ref.current && newRect && oldRect) {
          const x = newRect.left - oldRect.left;
          const y = newRect.top - oldRect.top;
          sortableTarget.ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });

      sortSession.finalIndex = overIndex;
    },
  });

  return {
    sortableProps: {...mergeProps(draggableProps, droppableProps)},
    dragHandleRef,
  };
}

const transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';

function addSortStyles() {
  if (!sortSession) return;
  sortSession.sortables.forEach((sortable, index) => {
    const droppable = droppables.get(sortable);
    if (!droppable?.ref.current) return;

    droppable.ref.current.style.transition = transition;

    if (sortSession?.activeIndex === index) {
      droppable.ref.current.style.opacity = '0.4';
    }
  });
}

// clear any styles and transforms applied to sortables during sorting
function removeSortStyles() {
  if (!sortSession) return;
  sortSession.sortables.forEach(sortable => {
    const droppable = droppables.get(sortable);
    if (droppable?.ref.current) {
      droppable.ref.current.style.transform = '';
      droppable.ref.current.style.transition = '';
      droppable.ref.current.style.opacity = '';
      droppable.ref.current.style.zIndex = '';
    }
  });
}

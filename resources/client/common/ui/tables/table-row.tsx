import React, {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  JSXElementConstructor,
  KeyboardEventHandler,
  MouseEventHandler,
  useContext,
} from 'react';
import {rowStyle} from './table-style';
import {TableContext} from './table-context';
import {CheckboxCell} from './checkbox-cell';
import {TableCell} from './table-cell';
import {TableDataItem} from './types/table-data-item';
import {createEventHandler} from '../../utils/dom/create-event-handler';
import {usePointerEvents} from '../interactions/use-pointer-events';
import {isCtrlOrShiftPressed} from '../../utils/keybinds/is-ctrl-or-shift-pressed';
import {useIsTouchDevice} from '../../utils/hooks/is-touch-device';

const interactableElements = ['button', 'a', 'input', 'select', 'textarea'];

export interface RowElementProps<T = TableDataItem>
  extends ComponentPropsWithoutRef<'tr'> {
  item: T;
}

interface TableRowProps {
  item: TableDataItem;
  index: number;
  renderAs?: JSXElementConstructor<RowElementProps>;
}
export function TableRow({item, index, renderAs}: TableRowProps) {
  const isTouchDevice = useIsTouchDevice();
  const {
    selectedRows,
    columns,
    toggleRow,
    selectRow,
    onAction,
    enableSelection,
    selectionStyle,
  } = useContext(TableContext);
  const isRowSelected = selectedRows.includes(item.id);

  const clickedOnInteractable = (e: React.MouseEvent | PointerEvent) => {
    return (e.target as HTMLElement).closest(interactableElements.join(','));
  };

  const doubleClickHandler: MouseEventHandler<HTMLDivElement> = e => {
    if (
      selectionStyle === 'highlight' &&
      onAction &&
      !isTouchDevice &&
      !clickedOnInteractable(e)
    ) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };

  const anyRowsSelected = !!selectedRows.length;

  const handleRowTap = (e: PointerEvent) => {
    if (clickedOnInteractable(e)) return;
    if (selectionStyle == 'checkbox') {
      if (enableSelection && (anyRowsSelected || !onAction)) {
        toggleRow(item);
      } else if (onAction) {
        onAction(item, index);
      }
    } else if (selectionStyle === 'highlight') {
      if (isTouchDevice) {
        if (enableSelection && anyRowsSelected) {
          toggleRow(item);
        } else {
          onAction?.(item, index);
        }
      } else if (enableSelection) {
        selectRow(item, isCtrlOrShiftPressed(e));
      }
    }
  };

  const {domProps} = usePointerEvents({
    onPress: handleRowTap,
    onLongPress:
      isTouchDevice && enableSelection ? () => toggleRow(item) : undefined,
  });

  const keyboardHandler: KeyboardEventHandler = e => {
    if (enableSelection && e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (selectionStyle === 'checkbox') {
        toggleRow(item);
      } else {
        selectRow(item);
      }
    } else if (e.key === 'Enter' && !selectedRows.length && onAction) {
      e.preventDefault();
      e.stopPropagation();
      onAction(item, index);
    }
  };

  // prevent context menu on mobile
  const contextMenuHandler: MouseEventHandler = e => {
    if (isTouchDevice) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const tableRowProps: HTMLAttributes<HTMLDivElement> = {
    'aria-selected': isRowSelected,
    className: rowStyle({isSelected: isRowSelected}),
    onDoubleClick: createEventHandler(doubleClickHandler),
    onKeyDown: createEventHandler(keyboardHandler),
    onContextMenu: createEventHandler(contextMenuHandler),
    ...domProps,
  };

  const RowElement = renderAs || 'tr';

  return (
    <RowElement
      item={RowElement === 'tr' ? (undefined as any) : item}
      {...tableRowProps}
      data-testid="table-row"
    >
      <CheckboxCell item={item} />
      {columns.map((column, cellIndex) => (
        <TableCell
          index={cellIndex}
          item={item}
          key={`${item.id}-${column.key}`}
        />
      ))}
    </RowElement>
  );
}

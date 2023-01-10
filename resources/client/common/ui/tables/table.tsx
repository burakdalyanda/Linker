import React, {
  ComponentProps,
  JSXElementConstructor,
  useCallback,
  useMemo,
} from 'react';
import {useControlledState} from '@react-stately/utils';
import {rowStyle} from './table-style';
import {SortDescriptor} from './types/sort-descriptor';
import {useGridNavigation} from './navigate-grid';
import {RowElementProps, TableRow} from './table-row';
import {
  TableContext,
  TableContextValue,
  TableSelectionStyle,
} from './table-context';
import {HeaderCell} from './header-cell';
import {SelectAllCell} from './select-all-cell';
import {ColumnConfig} from '../../datatable/column-config';
import {TableDataItem} from './types/table-data-item';
import clsx from 'clsx';

export interface TableProps<T extends TableDataItem>
  extends ComponentProps<'table'> {
  className?: string;
  columns: ColumnConfig<T>[];
  hideHeaderRow?: boolean;
  data: T[];
  selectedRows?: (number | string)[];
  defaultSelectedRows?: (number | string)[];
  onSelectionChange?: (keys: (number | string)[]) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => any;
  enableSelection?: boolean;
  selectionStyle?: TableSelectionStyle;
  ariaLabelledBy?: string;
  onAction?: (item: T, index: number) => void;
  renderRowAs?: JSXElementConstructor<RowElementProps<T>>;
}
export function Table<T extends TableDataItem>({
  className,
  columns,
  hideHeaderRow,
  data,
  selectedRows: propsSelectedRows,
  defaultSelectedRows: propsDefaultSelectedRows,
  onSelectionChange: propsOnSelectionChange,
  sortDescriptor: propsSortDescriptor,
  onSortChange: propsOnSortChange,
  enableSelection = true,
  selectionStyle = 'checkbox',
  ariaLabelledBy,
  onAction,
  renderRowAs,
  ...domProps
}: TableProps<T>) {
  const [selectedRows, onSelectionChange] = useControlledState(
    propsSelectedRows,
    propsDefaultSelectedRows || [],
    propsOnSelectionChange
  );

  const [sortDescriptor, onSortChange] = useControlledState(
    propsSortDescriptor,
    undefined,
    propsOnSortChange
  );

  const toggleRow = useCallback(
    (item: TableDataItem) => {
      const newValues = [...selectedRows];
      if (!newValues.includes(item.id)) {
        newValues.push(item.id);
      } else {
        const index = newValues.indexOf(item.id);
        newValues.splice(index, 1);
      }
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );

  const selectRow = useCallback(
    (item: TableDataItem, merge?: boolean) => {
      const newValues = merge ? [...selectedRows, item.id] : [item.id];
      onSelectionChange(newValues);
    },
    [selectedRows, onSelectionChange]
  );

  const contextValue: TableContextValue<T> = useMemo(() => {
    return {
      selectedRows,
      onSelectionChange,
      enableSelection,
      selectionStyle,
      data,
      columns,
      sortDescriptor,
      onSortChange,
      toggleRow,
      selectRow,
      onAction,
    };
  }, [
    columns,
    data,
    enableSelection,
    selectionStyle,
    onAction,
    onSelectionChange,
    onSortChange,
    selectedRows,
    sortDescriptor,
    toggleRow,
    selectRow,
  ]);

  const navProps = useGridNavigation({
    cellCount: enableSelection ? columns.length + 1 : columns.length,
    rowCount: data.length + 1,
  });

  const headerRow = hideHeaderRow ? null : (
    <thead>
      <tr aria-rowindex={1} className={rowStyle({isHeader: true})}>
        <SelectAllCell />
        {columns.map((column, columnIndex) => (
          <HeaderCell index={columnIndex} key={column.key} />
        ))}
      </tr>
    </thead>
  );

  return (
    <TableContext.Provider value={contextValue as any}>
      <table
        {...domProps}
        aria-multiselectable={enableSelection ? true : undefined}
        aria-labelledby={ariaLabelledBy}
        className={clsx(
          className,
          'select-none isolate outline-none text-sm w-full max-w-full align-top'
        )}
        {...navProps}
      >
        {headerRow}
        <tbody>
          {data.map((item, rowIndex) => (
            <TableRow
              item={item}
              index={rowIndex}
              key={item.id}
              renderAs={renderRowAs as any}
            />
          ))}
        </tbody>
      </table>
    </TableContext.Provider>
  );
}

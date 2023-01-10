import {useContext} from 'react';
import {cellStyle} from './table-style';
import {TableContext} from './table-context';
import {TableDataItem} from './types/table-data-item';

interface TableCellProps {
  index: number;
  item: TableDataItem;
  id?: string;
}
export function TableCell({index, item, id}: TableCellProps) {
  const {enableSelection, columns, selectedRows} = useContext(TableContext);
  const isFirst = enableSelection ? false : index === 0;
  const isLast = index === columns.length - 1;
  const column = columns[index];

  return (
    <td
      id={id}
      tabIndex={-1}
      data-testid={`col-${column.key}`}
      className={cellStyle({isFirst, isLast, column})}
    >
      {column.body(item, selectedRows)}
    </td>
  );
}

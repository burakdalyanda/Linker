import clsx from 'clsx';
import type {ColumnConfig} from '../../datatable/column-config';

interface CellStyleProps {
  isFirst?: boolean;
  isLast?: boolean;
  width?: string;
  isRowHeader?: boolean;
  column?: ColumnConfig<any>;
}
export function cellStyle({
  isFirst,
  isLast,
  isRowHeader,
  width,
  column,
}: CellStyleProps): string {
  // make first column twice as wide as others by default, as it's a name or title usually
  const finalWidth = column?.width || width || '';
  const userPadding = column?.padding;

  let justify = 'text-left';
  if (column?.align === 'center') {
    justify = 'text-center';
  } else if (column?.align === 'end') {
    justify = 'text-right';
  }

  return clsx(
    'overflow-hidden whitespace-nowrap h-48 outline-none focus-visible:outline focus-visible:outline-offset-2 rounded',
    justify,
    !userPadding && isFirst && 'pl-24 pr-16',
    !userPadding && isLast && 'pr-24 pl-16',
    !isFirst && !isLast && !userPadding && 'px-16',
    userPadding,
    finalWidth
  );
}

interface RowStyleProps {
  isHeader?: boolean;
  isSelected?: boolean;
  enabledSelection?: boolean;
}
export function rowStyle({
  isHeader,
  isSelected,
  enabledSelection,
}: RowStyleProps): string {
  return clsx(
    'break-inside-avoid border-b outline-none',
    isSelected &&
      'bg-primary/selected hover:bg-primary/focus focus-visible:bg-primary/focus',
    !isSelected &&
      !isHeader &&
      enabledSelection &&
      'focus-visible:bg-focus hover:bg-hover'
  );
}

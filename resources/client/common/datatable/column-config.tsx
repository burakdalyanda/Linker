import React, {ReactElement, ReactNode} from 'react';
import {TableDataItem} from '../ui/tables/types/table-data-item';

export interface ColumnConfig<T extends TableDataItem> {
  key: string;
  header: () => ReactElement;
  hideHeader?: boolean;
  align?: 'start' | 'center' | 'end';
  padding?: string;
  body: (item: T, selectedRows: (string | number)[]) => ReactNode;
  allowsSorting?: boolean;
  sortingKey?: string;
  width?: string;
}

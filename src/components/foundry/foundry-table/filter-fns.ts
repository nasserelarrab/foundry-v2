import { FilterFn } from '@tanstack/react-table';

export interface FilterValue {
  operator: 'contains' | 'equals' | 'greaterThan' | 'lessThan';
  value: string;
}

export const customFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterValue) => {
  const value = row.getValue(columnId);
  if (filterValue == null) return true;

  const { operator, value: filterVal } = filterValue;
  if (filterVal === '' || filterVal === undefined) return true;

  switch (operator) {
    case 'contains':
      return String(value).toLowerCase().includes(String(filterVal).toLowerCase());
    case 'equals':
      return String(value).toLowerCase() === String(filterVal).toLowerCase();
    case 'greaterThan':
      return Number(value) > Number(filterVal);
    case 'lessThan':
      return Number(value) < Number(filterVal);
    default:
      return true;
  }
};
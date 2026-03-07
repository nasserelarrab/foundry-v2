// utils/filterData.ts
import { getValue } from './getValue'; // your existing dot‑notation getter

export function filterData<T>(data: T[], filters: Array<{ path: string; operator: string; value: string }>): T[] {
  if (filters.length === 0) return data;
  return data.filter(item => {
    return filters.every(cond => {
      const val = getValue(item, cond.path);
      const filterVal = cond.value;
      if (val == null) return false;
      switch (cond.operator) {
        case 'contains':
          return String(val).toLowerCase().includes(filterVal.toLowerCase());
        case 'equals':
          return String(val).toLowerCase() === filterVal.toLowerCase();
        case 'greaterThan':
          return Number(val) > Number(filterVal);
        case 'lessThan':
          return Number(val) < Number(filterVal);
        default:
          return true;
      }
    });
  });
}
'use client';

import { useMemo, useState } from 'react';
import { ColumnConfig } from './column-config';
import { buildColumnsFromConfig } from './build-columns-from-config';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  Card,
  FoundryCardFooter,
  CardHeaderFoundry,
  FoundryCardTable,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FoundryTableHeader from '@/components/foundry/foundry-table/FoundryTableHeader';
import { getNestedFields, FieldInfo } from './getNestedFields';
import { getValue } from './build-columns-from-config'; // or from a separate utils file

// Define filter condition and sort config types
export interface FilterCondition {
  path: string;
  operator: 'contains' | 'equals' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface SortConfig {
  path: string;
  desc: boolean;
}

export interface FoundryTableProps<T = any> {
  columnConfig: ColumnConfig[];
  data: T[];
  rowIdField?: string;
  defaultPagination?: PaginationState;
  ActionsCell?: ({ row }: { row: any }) => React.ReactNode;
  customHeader?: React.ReactNode;
  tableLayout?: {
    columnsPinnable?: boolean;
    columnsMovable?: boolean;
    columnsVisibility?: boolean;
    cellBorder?: boolean;
    rowBorder?: boolean;
    headerBorder?: boolean;
    headerBackground?: boolean;
  };
}

// ----------------------------------------------------------------------
// Filtering function
// ----------------------------------------------------------------------
function filterData<T>(data: T[], filters: FilterCondition[]): T[] {
  if (filters.length === 0) return data;
  return data.filter(item => {
    return filters.every(cond => {
      const val = getValue(item, cond.path);
      const filterVal = cond.value;

      // Handle null/boolean operators first (they may not need filterVal)
      switch (cond.operator) {
        case 'isNull':
          return val === null || val === undefined;
        case 'isNotNull':
          return val !== null && val !== undefined;
        case 'isTrue':
          return val === true;
        case 'isFalse':
          return val === false;
      }

      // For other operators, if val is null/undefined, it can't match (unless operator is isNull/isNotNull)
      if (val == null) return false;

      // Now handle operators that require a value
      switch (cond.operator) {
        case 'contains':
          return String(val).toLowerCase().includes(filterVal.toLowerCase());
        case 'doesNotContain':
          return !String(val).toLowerCase().includes(filterVal.toLowerCase());
        case 'equals':
          return String(val).toLowerCase() === filterVal.toLowerCase();
        case 'notEquals':
          return String(val).toLowerCase() !== filterVal.toLowerCase();
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

// ----------------------------------------------------------------------
// Sorting function
// ----------------------------------------------------------------------
function sortData<T>(data: T[], sort: SortConfig | null): T[] {
  if (!sort) return data;
  const { path, desc } = sort;
  return [...data].sort((a, b) => {
    const aVal = getValue(a, path);
    const bVal = getValue(b, path);
    
    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return desc ? bVal - aVal : aVal - bVal;
    }
    // Handle dates
    if (aVal instanceof Date && bVal instanceof Date) {
      return desc ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
    }
    // Handle strings (or fallback)
    const aStr = String(aVal ?? '').toLowerCase();
    const bStr = String(bVal ?? '').toLowerCase();
    if (aStr < bStr) return desc ? 1 : -1;
    if (aStr > bStr) return desc ? -1 : 1;
    return 0;
  });
}

const FoundryTable = <T extends Record<string, any>>({
  columnConfig,
  data,
  rowIdField = 'id',
  defaultPagination = { pageIndex: 0, pageSize: 10 },
  ActionsCell,
  customHeader,
  tableLayout = {
    columnsPinnable: true,
    columnsMovable: true,
    columnsVisibility: true,
    cellBorder: true,
    rowBorder: true,
    headerBorder: false,
    headerBackground: false,
  },
}: FoundryTableProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const initial: VisibilityState = {};
    columnConfig.forEach((col) => {
      initial[col.id] = col.defaultVisible !== false;
    });
    return initial;
  });

  // Custom filter and sort state
  const [customFilters, setCustomFilters] = useState<FilterCondition[]>([]);
  const [customSort, setCustomSort] = useState<SortConfig | null>({
      path: 'id', // replace with a field that always exists
      desc: false,
  });

  // Global search
  const [globalFilter, setGlobalFilter] = useState('');

  // Extract all nested fields from the data (for sort/filter menus)
  const allFields = useMemo<FieldInfo[]>(() => {
    if (data.length === 0) return [];
    const merged = data.reduce((acc, item) => ({ ...acc, ...item }), {});
    const fields = getNestedFields(merged);
    console.log('Extracted fields:', fields); // Debug
    return fields;
  }, [data]);

  // Build columns from config
  const columns = useMemo<ColumnDef<T>[]>(() => {
    return buildColumnsFromConfig(columnConfig, { ActionsCell, rowIdField }) as ColumnDef<T>[];
  }, [columnConfig, ActionsCell, rowIdField]);

  // Compute visibleColumns for header
  const visibleColumnsObj = useMemo(() => {
    const obj: Record<string, boolean> = {};
    columnConfig.forEach((col) => {
      obj[col.id] = columnVisibility[col.id] !== false;
    });
    return obj;
  }, [columnVisibility, columnConfig]);

  const handleColumnToggle = (colId: string, visible: boolean) => {
    setColumnVisibility((prev) => ({ ...prev, [colId]: visible }));
  };

  // Process data: apply filters, then sorting
  const processedData = useMemo(() => {
    console.log('Applying filters:', customFilters);
    console.log('Applying sort:', customSort);
    let result = data;
    if (customFilters.length > 0) {
      result = filterData(result, customFilters);
    }
    if (customSort) {
      result = sortData(result, customSort);
    }
    console.log('Processed data count:', result.length);
    return result;
  }, [data, customFilters, customSort]);

  const table = useReactTable({
    columns,
    data: processedData, // Use processed data
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    pageCount: Math.ceil(processedData.length / pagination.pageSize),
    getRowId: (row: T) => row[rowIdField] || String(Math.random()),
    state: {
      pagination,
      columnVisibility,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // No sorting/filtering models – we handle them manually
  });

  return (
    <DataGrid
      table={table}
      recordCount={processedData.length}
      tableLayout={tableLayout}
    >
      <Card className="border-none">
        <CardHeaderFoundry>
          {customHeader || (
            <FoundryTableHeader
              searchQuery={globalFilter}
              onSearchChange={setGlobalFilter}
              fields={allFields}
              customSort={customSort}
              onSortChange={setCustomSort}
              customFilters={customFilters}
              onFiltersChange={setCustomFilters}
              visibleColumns={visibleColumnsObj}
              onColumnToggle={handleColumnToggle}
              onTabChange={(tab) => console.log('tab changed to', tab)}
            />
          )}
        </CardHeaderFoundry>
        <FoundryCardTable>
          <div style={{ overflow: 'hidden', borderRadius: 'inherit' }}>
            <ScrollArea>
              <style>{`
                [data-slot="data-grid-table"] { border: none !important; }
                [data-slot="data-grid-table"] tbody tr:first-child > td:first-child,
                [data-slot="data-grid-table"] tbody tr:first-child > td:last-child {
                  border-top: none;
                }
                [data-slot="data-grid-table"] tbody tr:last-child > td:first-child,
                [data-slot="data-grid-table"] tbody tr:last-child > td:last-child {
                  border-bottom: none;
                }
                [data-slot="data-grid-table"] tbody > tr > td:first-child {
                  border-left: none;
                }
                [data-slot="data-grid-table"] tbody > tr > td:last-child {
                  border-right: none;
                }
                [data-slot="data-grid-table"] thead tr > th:first-child {
                  border-left: none;
                }
                [data-slot="data-grid-table"] thead tr > th:last-child {
                  border-right: none;
                }
                [data-slot="data-grid-table"] thead tr > th {
                  border-bottom: 1px solid #e5e7eb !important;
                }
              `}</style>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </FoundryCardTable>
        <FoundryCardFooter>
          <DataGridPagination />
        </FoundryCardFooter>
      </Card>
    </DataGrid>
  );
};

export { FoundryTable };
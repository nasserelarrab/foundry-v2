'use client';

import { useMemo, useState } from 'react';
import { ColumnConfig } from './column-config';
import { buildColumnsFromConfig } from './build-columns-from-config';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
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

export interface FoundryTableProps<T = any> {
  columnConfig: ColumnConfig[];
  data: T[];
  rowIdField?: string;
  defaultPagination?: PaginationState;
  defaultSorting?: SortingState;
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

const FoundryTable = <T extends Record<string, any>>({
  columnConfig,
  data,
  rowIdField = 'id',
  defaultPagination = { pageIndex: 0, pageSize: 10 },
  defaultSorting = [{ id: 'title', desc: false }],
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
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    const initial: VisibilityState = {};
    columnConfig.forEach((col) => {
      initial[col.id] = col.defaultVisible !== false;
    });
    return initial;
  });

  // New states for filtering
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Build columns from config
  const columns = useMemo<ColumnDef<T>[]>(() => {
    return buildColumnsFromConfig(columnConfig, { ActionsCell, rowIdField }) as ColumnDef<T>[];
  }, [columnConfig, ActionsCell, rowIdField]);

  // Compute visibleColumns object for header
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

  // Compute sortable and filterable columns (only data columns)
  const sortableColumns = useMemo(() => {
    return columnConfig
      .filter(col => col.type === 'data')
      .map(col => ({ id: col.id, header: col.header || col.id }));
  }, [columnConfig]);

  const filterableColumns = useMemo(() => {
    return columnConfig
      .filter(col => col.type === 'data')
      .map(col => ({ id: col.id, header: col.header || col.id, dataType: 'string' }));
  }, [columnConfig]);

  const table = useReactTable({
    columns,
    data, // original data, table handles filtering
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    pageCount: Math.ceil(data.length / pagination.pageSize),
    getRowId: (row: T) => row[rowIdField] || String(Math.random()),
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={table.getFilteredRowModel().rows.length}
      tableLayout={tableLayout}
    >
      <Card className="border-none">
        <CardHeaderFoundry>
          {customHeader || (
            <FoundryTableHeader
              searchQuery={globalFilter}
              onSearchChange={setGlobalFilter}
              filtersCount={columnFilters.length}
              sorting={sorting}
              onSortingChange={setSorting}
              sortableColumns={sortableColumns}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              filterableColumns={filterableColumns}
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
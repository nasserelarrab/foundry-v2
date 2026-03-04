'use client';

import { useMemo, useState } from 'react';
import { ColumnConfig } from './column-config';
import { buildColumnsFromConfig } from './build-columns-from-config.tsx';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import {
  Card,
  FoundryCardFooter,
  CardHeaderFoundry,
  FoundryCardTable,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import FoundryTableHeader from '@/components/foundry/FoundryTableHeader';

export interface FoundryTableProps<T = any> {
  /** Configuration driving columns/fields */
  columnConfig: ColumnConfig[];
  /** Data to display in the table */
  data: T[];
  /** Optional unique ID field for rows (defaults to 'id') */
  rowIdField?: string;
  /** Show checkbox column for row selection */
  showCheckbox?: boolean;
  /** Show actions cell column */
  showActionsCell?: boolean;
  /** Default pagination state */
  defaultPagination?: PaginationState;
  /** Default sorting state */
  defaultSorting?: SortingState;
  /** Custom actions cell component */
  ActionsCell?: ({ row }: { row: any }) => React.ReactNode;
  /** Custom header component */
  customHeader?: React.ReactNode;
  /** Table layout options */
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
  showCheckbox = false,
  showActionsCell = true,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by selected filters
      const matchesFilters =
        !selectedFilters?.length ||
        selectedFilters.some((filter) => {
          // This is a generic filter - you might want to customize this based on your data structure
          return Object.values(item).some((value) => 
            value && String(value).toLowerCase().includes(filter.toLowerCase())
          );
        });

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        Object.values(item).some((value) => 
          value && String(value).toLowerCase().includes(searchLower)
        );

      return matchesFilters && matchesSearch;
    });
  }, [searchQuery, selectedFilters, data]);

  // Build columns from config
  const columns = useMemo<ColumnDef<T>[]>(() => {
    const base: ColumnDef<T>[] = [];

    // Add checkbox column if enabled
    if (showCheckbox) {
      base.push({
        accessorKey: rowIdField,
        accessorFn: (row) => row[rowIdField],
        header: () => <DataGridTableRowSelectAll disabled={false} />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} disabled={false} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        meta: {
          cellClassName: '',
        },
      } as ColumnDef<T>);
    }

    // Add dynamic columns from config
    const configColumns = buildColumnsFromConfig(columnConfig) as ColumnDef<T>[];
    
    // Add actions column if ActionsCell is provided and showActionsCell is true
    if (ActionsCell && showActionsCell) {
      configColumns.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        enableResizing: false,
        size: 80,
        meta: {
          cellClassName: '',
        },
      } as ColumnDef<T>);
    }

    return base.concat(configColumns);
  }, [columnConfig, showCheckbox, rowIdField, ActionsCell, showActionsCell]);

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: T) => row[rowIdField] || String(Math.random()),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={tableLayout}
    >
      <Card className="border-none">
        <CardHeaderFoundry>
          {customHeader || (
            <FoundryTableHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filtersCount={selectedFilters.length}
              onTabChange={(tab) => {
                console.log('tab changed to', tab);
              }}
            />
          )}
        </CardHeaderFoundry>
        <FoundryCardTable>
          <div
            style={{
              overflow: 'hidden',
              borderRadius: 'inherit',
            }}
          >
            <ScrollArea>
              <style>
                {`
                  /* remove panel-level border entirely */
                  [data-slot="data-grid-table"] { border: none !important; }
                  /* Hide outer borders, keep inner borders */
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
                  /* restore header row bottom border by targeting cells (handles collapse) */
                  [data-slot="data-grid-table"] thead tr > th {
                    border-bottom: 1px solid #e5e7eb !important; /* tailwind border-gray-200 */
                  }
                `}
              </style>
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

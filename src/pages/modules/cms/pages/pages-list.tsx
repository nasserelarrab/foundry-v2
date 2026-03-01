'use client';

import { useMemo, useState } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  EllipsisVertical,
  Filter,
  Search,
  Settings2,
  UserRoundPlus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  FoundryCardFooter,
  cardHeaderFoundry,
  CardHeading,
  FoundryCardTable,
  CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

// new header component derived from Figma/Foundry design
import FoundryTableHeader from '@/components/foundry/FoundryTableHeader';

// page list data (mocked to match new design screenshot)
interface IData {
  id: string;
  title: string;
  path: string;
  seo: {
    label: string; // GOOD, BAD, OK, etc
    score: number;
    example?: string;
  };
  updated: {
    user: string;
    time: string;
  };
  publication: 'Published' | 'Scheduled' | 'Draft';
  blocks: number;
}

const data: IData[] = [
  {
    id: '1',
    title: 'Home - Main English',
    path: '/',
    seo: { label: 'GOOD', score: 92, example: '"Modern Furniture"' },
    updated: { user: 'Ahmed', time: '2 hours ago' },
    publication: 'Published',
    blocks: 12,
  },
  {
    id: '2',
    title: 'About Our Mission',
    path: '/about-us',
    seo: { label: 'GOOD', score: 85, example: '"Our Story"' },
    updated: { user: 'Sarah K.', time: '5 hours ago' },
    publication: 'Published',
    blocks: 5,
  },
  {
    id: '3',
    title: 'Summer Collection 2024',
    path: '/summer-collection',
    seo: { label: 'BAD', score: 45, example: '"Summer Trends"' },
    updated: { user: 'Ahmed', time: '2 days ago' },
    publication: 'Scheduled',
    blocks: 3,
  },
  {
    id: '4',
    title: 'About Us - عن نحن',
    path: '/about-us-ar',
    seo: { label: 'BAD', score: 12, example: '"عن نحن"' },
    updated: { user: 'Layla M.', time: '3 hours ago' },
    publication: 'Draft',
    blocks: 2,
  },
  {
    id: '5',
    title: 'Team Members',
    path: '/about-us/team',
    seo: { label: 'OK', score: 78, example: '"Management Team"' },
    updated: { user: 'Sarah K.', time: '1 week ago' },
    publication: 'Published',
    blocks: 8,
  },
  // additional rows can be added here for testing
];

function ActionsCell({ row }: { row: Row<IData> }) {
  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `Member ID successfully copied: ${row.original.id}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PagesList = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'recentlyActivity', desc: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // control whether checkbox column is visible (default false per request)
  const showCheckbox = false;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by publication status
      const matchesStatus =
        !selectedStatuses?.length ||
        selectedStatuses.includes(item.publication);

      // Filter by search query (case-insensitive)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchLower) ||
        item.path.toLowerCase().includes(searchLower);

      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedStatuses]);

  const statusCounts = useMemo(() => {
    return data.reduce((acc, item) => {
      acc[item.publication] = (acc[item.publication] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev = []) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const columns = useMemo<ColumnDef<IData>[]>(
    () => {
      const base: ColumnDef<IData>[] = [];

      if (showCheckbox) {
        base.push({
          accessorKey: 'id',
          accessorFn: (row) => row.id,
          header: () => <DataGridTableRowSelectAll disabled={false} />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} disabled={false} />,
          enableSorting: false,
          enableHiding: false,
          enableResizing: false,
          meta: {
            cellClassName: '',
          },
        });
      }

      return base.concat([
        {
          id: 'title',
          accessorFn: (row) => row.title,
          header: ({ column }) => (
            <DataGridColumnHeader title="Page" column={column} />
          ),
          cell: ({ row }) => (
            <div className="flex flex-col">
              <span className="font-medium text-sm text-foreground">
                {row.original.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {row.original.path}
              </span>
            </div>
          ),
          enableSorting: true,
          enableResizing: true,
          // use auto-width (no size) to allow flex behaviour
          meta: {
            cellClassName: '',
          },
        },
      {
        id: 'seo',
        accessorFn: (row) => row.seo,
        header: ({ column }) => (
          <DataGridColumnHeader title="SEO" column={column} />
        ),
        cell: ({ row }) => {
          const seo = row.original.seo;
          let variant: 'success' | 'destructive' | 'warning' | 'primary' =
            seo.label === 'GOOD'
              ? 'success'
              : seo.label === 'BAD'
              ? 'destructive'
              : 'primary';
          return (
            <div className="flex flex-col">
              <Badge variant={variant} appearance="light">
                {seo.label} ({seo.score})
              </Badge>
              {seo.example && (
                <span className="text-xs text-muted-foreground">
                  {seo.example}
                </span>
              )}
            </div>
          );
        },
        enableSorting: true,
        enableResizing: true,
        // flex width; allow natural sizing
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'updated',
        accessorFn: (row) => row.updated,
        header: ({ column }) => (
          <DataGridColumnHeader title="Updated" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-sm text-foreground">
              {row.original.updated.user}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.updated.time}
            </span>
          </div>
        ),
        enableSorting: true,
        enableResizing: true,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'publication',
        accessorFn: (row) => row.publication,
        header: ({ column }) => (
          <DataGridColumnHeader title="Publication" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.publication}</span>
        ),
        enableSorting: true,
        enableResizing: true,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'blocks',
        accessorFn: (row) => row.blocks,
        header: ({ column }) => (
          <DataGridColumnHeader title="Blocks" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.blocks}</span>
        ),
        enableSorting: true,
        enableResizing: true,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: '',

        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 60,
        meta: {
          headerClassName: '',
        },
      },
    ]);
  },
    [],
  );

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
    getRowId: (row: IData) => row.id,
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

  // toolbar replaced by new header component; kept here in case we need it later
  // const Toolbar = () => {
  //   const { table } = useDataGrid();
  //
  //   return (
  //     <CardToolbar>
  //       <div className="flex flex-wrap items-center gap-2.5">
  //         <Label htmlFor="auto-update" className="text-sm">
  //           Active Users
  //         </Label>
  //         <Switch size="sm" id="auto-update" defaultChecked />
  //         <Button>
  //           <UserRoundPlus />
  //           Add New
  //         </Button>
  //       </div>
  //       <DataGridColumnVisibility
  //         table={table}
  //         trigger={
  //           <Button variant="outline">
  //             <Settings2 />
  //             Columns
  //           </Button>
  //         }
  //       />
  //     </CardToolbar>
  //   );
  // };

  return (
    <DataGrid
      table={table}
      recordCount={filteredData?.length || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
        rowBorder: true,
        headerBorder: false,
        headerBackground: false,
      }}
    >
      <Card className="border-none">
        <cardHeaderFoundry  >
          <FoundryTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filtersCount={selectedStatuses.length}
          onTabChange={(tab) => {
            // handle tab change if needed
            console.log('tab changed to', tab);
          }}
        />
        {/* the old search + popover and toolbar have been removed in favour of the new header component */}
        </cardHeaderFoundry>
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

export { PagesList };

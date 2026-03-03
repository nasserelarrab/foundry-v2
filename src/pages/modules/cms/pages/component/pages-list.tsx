'use client';

import { RiCheckboxCircleFill } from '@remixicon/react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Row } from '@tanstack/react-table';
import { FoundryTable } from '@/components/foundry/foundry-table/foundry-table';
import { PAGES_LIST_CONFIG } from '../config/pages-list-table.config';

// The PagesList component is now configurable via props. You can supply
// a `columnConfig` array (see `src/config/column-config.ts` for shape) and
// optionally a `dataOverride` array loaded from JSON to change both the
// columns rendered and the data displayed. Example usage:
//
//   import { PAGES_COLUMN_CONFIG } from '@/components/foundry/foundry-table/column-config';
//   import sampleData from '@/components/foundry/foundry-table/pages-mock.json';
//
//   <PagesList
//     columnConfig={PAGES_COLUMN_CONFIG}
//     dataOverride={sampleData}
//   />
//
// This makes the table reusable from other pages with different object
// schemas; you simply map object properties to column fields and select
// UI types (text, badge, slug) as needed.

// page list data (mocked to match new design screenshot)
interface IData {
  id: string;
  title: string;
  path: string;
  parentId?: string; // for standalone child rows
  lang?: string;
  type?: string;
  status?: string;
  seo: {
    label: string; // GOOD, BAD, OK, etc
    score: number;
    example?: string;
  };
  updated?: {
    user?: string;
    time?: string;
  };
  publication?: 'Published' | 'Scheduled' | 'Draft';
  blocks?: number;
}

// later we may import a large JSON file; for now keep the inline data
const data: IData[] = [
  {
    id: '1',
    title: 'Home - Main English',
    path: '/',
    lang: 'EN',
    type: 'Basic',
    status: 'Published',
    seo: { label: 'GOOD', score: 92, example: '"Modern Furniture"' },
    updated: { user: 'Ahmed', time: '2 hours ago' },
    publication: 'Published',
    blocks: 12,
  },
  {
    id: '2',
    title: 'About Our Mission',
    path: '/about-us',
    lang: 'EN',
    type: 'Basic',
    status: 'Published',
    seo: { label: 'GOOD', score: 85, example: '"Our Story"' },
    updated: { user: 'Sarah K.', time: '5 hours ago' },
    publication: 'Published',
    blocks: 5,
  },
  {
    id: '3',
    title: 'Summer Collection 2024',
    path: '/summer-collection',
    lang: 'EN',
    type: 'Landing',
    status: 'Scheduled',
    seo: { label: 'BAD', score: 45, example: '"Summer Trends"' },
    updated: { user: 'Ahmed', time: '2 days ago' },
    publication: 'Scheduled',
    blocks: 3,
  },
  {
    id: '3-1',
    parentId: '3',
    title: 'Landing',
    path: '/summer-collection/landing',
    lang: 'EN',
    type: 'Landing',
    status: 'Scheduled',
    seo: { label: 'BAD', score: 45, example: '' },
    publication: 'Scheduled',
  },
  {
    id: '4',
    title: 'About Us - عن نحن',
    path: '/about-us-ar',
    lang: 'AR',
    type: 'Content',
    status: 'Draft',
    seo: { label: 'BAD', score: 12, example: '"عن نهم"' },
    updated: { user: 'Layla M.', time: '3 hours ago' },
    publication: 'Draft',
    blocks: 2,
  },
  {
    id: '5',
    title: 'Team Members',
    path: '/about-us/team',
    lang: 'EN',
    type: 'Staff',
    status: 'Published',
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

interface PagesListProps {
  /** configuration driving columns/fields; each consuming page provides its own file */
  columnConfig?: any[];
  dataOverride?: IData[];
}

const PagesList = ({ columnConfig = PAGES_LIST_CONFIG, dataOverride }: PagesListProps) => {
  const sourceData = dataOverride || data;

  return (
    <FoundryTable<IData>
      columnConfig={columnConfig}
      data={sourceData}
      ActionsCell={ActionsCell}
      showCheckbox={false}
      defaultSorting={[{ id: 'title', desc: false }]}
    />
  );
};

export { PagesList };

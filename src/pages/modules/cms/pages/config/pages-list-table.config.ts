import type { ColumnConfig } from '@/components/foundry/foundry-table/column-config';

// this file owns the column configuration for the /cms/pages/list view.
// each page that uses the generic `PagesList` component gets its own
// config file alongside it, so the module remains self‑contained.

export const PAGES_LIST_CONFIG: ColumnConfig[] = [
  {
    id: 'page',
    header: 'Page',
    fields: [
      { path: 'title', ui: 'text' },
      { path: 'path', ui: 'slug' },
      { paths: ['lang', 'status', 'type'], ui: 'tag' },
    ],
    flex: true,
  },
  {
    id: 'seo',
    header: 'SEO',
    fields: [
      { path: 'seo.label', ui: 'badge', badgeColor: '#10B981' },
      { path: 'seo.example', ui: 'italic' },
    ],
    flex: true,
  },
  {
    id: 'updated',
    header: 'Updated',
    fields: [
      { path: 'updated.user', ui: 'text' },
      { path: 'updated.time', ui: 'text' },
    ],
    // width: '20%',
    flex: true,
  },
  {
    id: 'publication',
    header: 'Publication',
    fields: [{ path: 'publication', ui: 'badge', badgeColor: '#3B82F6' }],
    // width: '10%',
    flex: true,
  },
  {
    id: 'blocks',
    header: 'Blocks',
    fields: [{ path: 'blocks', ui: 'text' }],
    // width: '10%',
    flex: true,
  },
];

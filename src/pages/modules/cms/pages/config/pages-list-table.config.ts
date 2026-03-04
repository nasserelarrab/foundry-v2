import type { ColumnConfig } from '@/components/foundry/foundry-table/column-config';

// this file owns the column configuration for the /cms/pages/list view.
// each page that uses the generic `PagesList` component gets its own
// config file alongside it, so the module remains self‑contained.

export const PAGES_LIST_CONFIG: ColumnConfig[] = [
  {
    id: 'title',
    header: 'Page',
    fields: [
      { path: 'title', ui: 'strong-text' },
      { path: 'path', ui: 'slug' },
      { paths: ['lang', 'status', 'type'], ui: 'tag' },
    ],
    width: '20%',
    flex: true,
  },
  {
    id: 'seo',
    header: 'SEO',
    fields: [
      { path: 'seo.label', ui: 'status-badge' },
      { path: 'seo.example', ui: 'italic' },
    ],
    flex: true,
  },
  {
    id: 'updated',
    header: 'Updated',
    fields: [
      { path: 'updated.avatar', ui: 'avatar' },
      { path: 'updated.user', ui: 'text' },
      { path: 'updated.time', ui: 'time' },
    ],
    // width: '20%',
    flex: true,
  },
  {
    id: 'publication',
    header: 'Publication',
    fields: [{ path: 'publication.status', ui: 'text', iconType: 'publication' },{path: 'publication.date', ui: 'date'}],
    // width: '10%',
    flex: true,
  },
  {
    id: 'blocks',
    header: 'Blocks',
    fields: [{ path: 'blocks', ui: 'strong-number' }],
    // width: '10%',
    flex: true,
  },
];

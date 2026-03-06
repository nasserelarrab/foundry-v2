import type { ColumnConfig } from '@/components/foundry/foundry-table/column-config';

// this file owns the column configuration for the /cms/pages/list view.
// each page that uses the generic `PagesList` component gets its own
// config file alongside it, so the module remains self‑contained.

export const PAGES_LIST_CONFIG: ColumnConfig[] = [
   // Checkbox column
    {
    id: 'select',
    type: 'checkbox',
    header: '',                    // optional, can be empty
    enableHiding: true,            // allow hiding (optional)
    defaultVisible: false,
    fields: [],
  },
  {
    id: 'title',
    header: 'Page',
    fields: [
      { path: 'title', ui: 'strong-text' },
      { path: 'path', ui: 'slug' },
      { paths: ['lang', 'status', 'type'], ui: 'tag' },
    ],

    flex: true,
    defaultVisible: true,
  },
  {
    id: 'seo',
    header: 'SEO',
    fields: [
      { path: 'seo.label', ui: 'status-badge' },
      { path: 'seo.example', ui: 'italic' },
    ],
    flex: true,
    defaultVisible: true,
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
    defaultVisible: true,
  },
  {
    id: 'publication',
    header: 'Publication',
    fields: [{ path: 'publication.status', ui: 'text', iconType: 'publication' },{path: 'publication.date', ui: 'date'}],
    // width: '10%',
    flex: true,
    defaultVisible: true,
  },
  {
    id: 'blocks',
    header: 'Blocks',
    fields: [{ path: 'blocks', ui: 'strong-number' }],
     width: '20',
    // flex: true,
    defaultVisible: false,
  },
      // Actions column
  {
    id: 'actions',
    type: 'actions',
    header: 'Actions', // optional, defaults to 'Actions'
    enableHiding: true,
    defaultVisible: false,
    fields: []
  },
];

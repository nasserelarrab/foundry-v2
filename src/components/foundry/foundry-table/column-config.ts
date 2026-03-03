// configuration for dynamic table columns

import { Document, Home, People, StatusOnline } from '@/components/icons';

export type FieldUI = 'text' | 'badge' | 'slug' | 'custom' | 'tag' | 'italic' | 'image';
// 'slug' renders muted/path-style text (no interactive link)
// 'custom' is for array values which should be displayed specially (e.g. tags)
// 'tag' renders compact gray inline tags (for page tags)
// 'badge' renders compact colored inline badges fitting text only; customize with badgeColor
// 'italic' renders muted italic text
// 'image' renders an image from the path (for avatars, thumbnails, etc.)


export interface FieldConfig {
  /** property path(s) within row object, e.g. 'title' or 'seo.score' */
  path?: string;
  /** multiple paths to fetch and combine (e.g. ['lang', 'status', 'type']) */
  paths?: string[];
  ui?: FieldUI;
  /** for badge/rich text variants */
  badgeVariant?: string; // pass to UI.badge variant property
  /** apply gray background to badge */
  gray?: boolean;
  /** custom background color for badge (e.g. '#10B981', 'rgb(16, 185, 129)') */
  badgeColor?: string;
  /** icon to display before the field value */
  icon?: React.ReactNode;
}

export interface ColumnConfig {
  /** unique column id */
  id: string;
  header: string;
  fields: FieldConfig[];
  /** width spec: either percent string, or flex flag to auto-size + padding */
  width?: string;
  flex?: boolean;
}

// example configuration mirroring pages-list usage
export const PAGES_COLUMN_CONFIG: ColumnConfig[] = [
  {
    id: 'page',
    header: 'Page',
    fields: [
      { path: 'title', ui: 'text', icon: <Document style={{ width: 16, height: 16, marginRight: 4 }} /> },
      { path: 'path', ui: 'slug', icon: <Home style={{ width: 16, height: 16, marginRight: 4 }} /> },
      { paths: ['lang', 'status', 'type'], ui: 'tag' },
    ],
    flex: true,
  },
  {
    id: 'seo',
    header: 'SEO',
    fields: [
      { path: 'seo.label', ui: 'badge', badgeVariant: 'success' },
      { path: 'seo.example', ui: 'italic' },
    ],
    flex: true,
  },
  {
    id: 'updated',
    header: 'Updated',
    fields: [
      { path: 'updated.user', ui: 'text', icon: <People style={{ width: 16, height: 16, marginRight: 4 }} /> },
      { path: 'updated.time', ui: 'text' },
    ],
    width: '20%',
  },
  {
    id: 'publication',
    header: 'Publication',
    fields: [{ path: 'publication', ui: 'badge' }],
    width: '10%',
  },
  {
    id: 'blocks',
    header: 'Blocks',
    fields: [{ path: 'blocks', ui: 'text' }],
    width: '10%',
  },
];

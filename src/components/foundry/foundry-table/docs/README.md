# Foundry Table Configuration

This folder contains documentation related to the reusable **Foundry** data grid table.

## Key files

- `../column-config.ts` – Type definitions and sample column configuration used by `PagesList`.
- `../pages-mock.json` – Example JSON dataset that can be provided via `dataOverride` prop.

## Usage

1. Each page that uses the table should live alongside its own
   column configuration file.  For example, the CMS pages list keeps
   `pages-list-table.config.ts` next to the component and exports a
   `PAGES_LIST_CONFIG` array.  That module is imported by the page when
   rendering the table.

   You can still examine the shared example below, but the intent is for
   configs to be page‑scoped.

   ```ts
   import { PAGES_COLUMN_CONFIG } from '@/components/foundry/foundry-table/column-config';
   import sampleData from '@/components/foundry/foundry-table/pages-mock.json';
   ```

2. Render the table component with props:

```tsx
<PagesList
  columnConfig={PAGES_COLUMN_CONFIG}
  dataOverride={sampleData}
/>
```

3. To create a new table elsewhere, copy the shape of `ColumnConfig` and supply matching data. The config allows:
   * multiple field entries per column
   * control over UI type (`text`, `badge`, `slug`, `custom`)
   * fixed or flex width (flex adds +20% of largest content)

## Extending

- Additional UI types can be added by enhancing the `FieldUI` union and updating the cell renderer in `pages-list.tsx`.
- For very complex cells, use `ui: 'custom'` and handle the array value rendering yourself.

This document is intentionally high‑level; refer to the source files for implementation details.

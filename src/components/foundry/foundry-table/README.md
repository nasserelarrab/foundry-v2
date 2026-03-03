# FoundryTable - Reusable Table Component

A highly configurable and reusable table component built on top of TanStack Table with Foundry design system integration.

## Features

- **Configurable Columns**: Define columns using configuration objects
- **Multiple UI Types**: Support for text, badge, slug, tag, and custom UI types
- **Actions**: Built-in support for row actions
- **Selection**: Optional checkbox column for row selection
- **Sorting & Pagination**: Built-in sorting and pagination
- **Search**: Integrated search functionality
- **Responsive**: Mobile-friendly design with horizontal scrolling
- **TypeScript**: Full TypeScript support

## Basic Usage

```tsx
import { FoundryTable } from '@/components/foundry/foundry-table/foundry-table';
import { ColumnConfig } from '@/components/foundry/foundry-table/column-config';

// Define your data interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Define column configuration
const userColumns: ColumnConfig[] = [
  {
    id: 'user',
    header: 'User',
    fields: [
      { path: 'name', ui: 'text' },
      { path: 'email', ui: 'slug' },
    ],
    flex: true,
  },
  {
    id: 'role',
    header: 'Role',
    fields: [{ path: 'role', ui: 'badge', badgeColor: '#3B82F6' }],
    width: '120px',
  },
];

// Use the component
function UserTable() {
  return (
    <FoundryTable<User>
      columnConfig={userColumns}
      data={usersData}
      ActionsCell={ActionsCell}
      showCheckbox={true}
    />
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `columnConfig` | `ColumnConfig[]` | Array of column configurations |
| `data` | `T[]` | Array of data to display |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rowIdField` | `string` | `'id'` | Field to use as unique row identifier |
| `showCheckbox` | `boolean` | `false` | Show checkbox column for row selection |
| `defaultPagination` | `PaginationState` | `{ pageIndex: 0, pageSize: 10 }` | Default pagination state |
| `defaultSorting` | `SortingState` | `[{ id: 'title', desc: false }]` | Default sorting state |
| `ActionsCell` | `Component` | `undefined` | Component for row actions |
| `customHeader` | `ReactNode` | `undefined` | Custom header component |
| `tableLayout` | `object` | See defaults | Table layout options |

## Column Configuration

Each column is defined by a `ColumnConfig` object:

```typescript
interface ColumnConfig {
  id: string;                    // Unique column identifier
  header: string;                 // Column header text
  fields: FieldConfig[];          // Array of field configurations
  width?: string;                 // Fixed width (e.g., '200px', '20%')
  flex?: boolean;                 // Flexible width (auto-size + padding)
}

interface FieldConfig {
  path?: string;                  // Single property path (e.g., 'name', 'user.email')
  paths?: string[];               // Multiple paths to combine
  ui?: FieldUI;                  // UI type: 'text' | 'badge' | 'slug' | 'tag' | 'custom'
  badgeColor?: string;            // Custom badge color (for badge UI)
}
```

## UI Types

### `text`
Renders plain text content.

```typescript
{ path: 'name', ui: 'text' }
```

### `badge`
Renders colored badges.

```typescript
{ path: 'status', ui: 'badge', badgeColor: '#10B981' }
```

### `slug`
Renders muted/path-style text.

```typescript
{ path: 'email', ui: 'slug' }
```

### `tag`
Renders compact gray inline tags.

```typescript
{ paths: ['lang', 'type'], ui: 'tag' }
```

### `custom`
For array values with special rendering.

```typescript
{ path: 'tags', ui: 'custom' }
```

## Actions Cell

Provide an `ActionsCell` component to add row-specific actions:

```typescript
function ActionsCell({ row }: { row: Row<YourDataType> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="sm">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row.original)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Advanced Usage

### Custom Header

Replace the default header with a custom component:

```typescript
<FoundryTable
  columnConfig={columns}
  data={data}
  customHeader={<MyCustomHeader />}
/>
```

### Nested Data Access

Access nested properties using dot notation:

```typescript
{
  id: 'user',
  header: 'User',
  fields: [
    { path: 'user.name', ui: 'text' },
    { path: 'user.profile.email', ui: 'slug' },
  ],
}
```

### Multiple Fields in One Column

Combine multiple data fields in a single column:

```typescript
{
  id: 'metadata',
  header: 'Metadata',
  fields: [
    { paths: ['createdAt', 'updatedAt'], ui: 'tag' },
  ],
}
```

## Migration from PagesList

The original `PagesList` component now uses `FoundryTable` internally. To migrate:

1. Define your `ColumnConfig` array
2. Pass your data and configuration to `FoundryTable`
3. Optionally provide an `ActionsCell` component

```typescript
// Before
<PagesList columnConfig={config} dataOverride={data} />

// After
<FoundryTable
  columnConfig={config}
  data={data}
  ActionsCell={ActionsCell}
  showCheckbox={false}
/>
```

## Files

- `foundry-table.tsx` - Main reusable component
- `build-columns-from-config.ts` - Column building utility
- `column-config.ts` - Type definitions
- `example-usage.tsx` - Example implementation

/**
 * Utility to build ColumnDef array from ColumnConfig configuration.
 * This allows reusable, config-driven table columns across any page.
 * 
 * Usage:
 *   import { buildColumnsFromConfig } from '@/components/foundry/foundry-table/build-columns-from-config';
 *   import { PAGES_LIST_CONFIG } from '@/pages/modules/cms/pages/config/pages-list-table.config';
 *   
 *   const columns = buildColumnsFromConfig(PAGES_LIST_CONFIG);
 */

import { ColumnDef } from '@tanstack/react-table';
import { ColumnConfig, FieldConfig } from './column-config';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

/**
 * Helper to darken a hex color by a certain percentage
 */
const darkenColor = (color: string, percent: number = 50): string => {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Darken each color
  const darkenedR = Math.round(r * (1 - percent / 100));
  const darkenedG = Math.round(g * (1 - percent / 100));
  const darkenedB = Math.round(b * (1 - percent / 100));
  
  // Convert back to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
};

/**
 * Helper to read value by dot-notation path string
 * @param row - object to read from
 * @param path - dot-separated path (e.g., 'seo.label')
 */
export const getValue = (row: any, path?: string): any => {
  if (!path) return undefined;
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), row);
};

/**
 * Build column definitions from configuration.
 * Handles multiple UI types: text, badge, tag, slug, custom
 * Supports single and multi-value fields via `path` and `paths`.
 * 
 * @param configs - Array of ColumnConfig defining structure and rendering
 * @returns ColumnDef array ready for @tanstack/react-table
 */
export const buildColumnsFromConfig = (configs: ColumnConfig[]): ColumnDef<any>[] => {
  return configs.map((cfg) => {
    return {
      id: cfg.id,
      header: ({ column }: any) => (
        <DataGridColumnHeader title={cfg.header} column={column} />
      ),
      accessorFn: (row: any) => row,
      cell: ({ row }: any) => {
        const vals = cfg.fields.map((f) => {
          // if field has multiple paths, fetch all and return as array
          if (f.paths && f.paths.length) {
            return f.paths.map((p) => getValue(row.original, p));
          }
          // single path
          return getValue(row.original, f.path);
        });
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              ...(cfg.flex
                ? { minWidth: 'calc(max-content + 20%)' }
                : {}),
            }}
          >
            {vals.map((v, idx) => {
              const f = cfg.fields[idx];
              if (f.ui === 'tag') {
                if (Array.isArray(v)) {
                  // multiple tags in one line
                  const filteredVals = v.filter((item) => item != null);
                  if (!filteredVals.length) {
                    return <span key={idx} className="text-xs text-muted-foreground">—</span>;
                  }
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {filteredVals.map((item: any, j: number) => (
                        <span
                          key={j}
                          style={{
                            fontSize: '12px',
                            padding: '2px 6px',
                            background: '#E5E7EB',
                            borderRadius: '4px',
                            color: '#374151',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  );
                } else {
                  if (v == null) {
                    return <span key={idx} className="text-xs text-muted-foreground">—</span>;
                  }
                  return (
                    <span
                      key={idx}
                      style={{
                        fontSize: '12px',
                        padding: '2px 6px',
                        background: '#E5E7EB',
                        borderRadius: '4px',
                        color: '#374151',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v}
                    </span>
                  );
                }
              }
              if (f.ui === 'badge') {
                if (Array.isArray(v)) {
                  // multiple badges in one line when paths is used
                  const filteredVals = v.filter((item) => item != null); // remove undefined/null
                  if (!filteredVals.length) {
                    return <span key={idx} className="text-xs text-muted-foreground" style={{ paddingBottom: '5px' }}>—</span>; // show dash if all undefined
                  }
                  return (
                    <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px' }}>
                      {filteredVals.map((item: any, j: number) => (
                        <span
                          key={j}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: f.badgeColor || '#10B981',
                            color: f.badgeColor ? darkenColor(f.badgeColor) : '#047857',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            lineHeight: '1.2',
                            minWidth: 'fit-content',
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  );
                } else {
                  // single badge
                  if (v == null) {
                    return <span key={idx} className="text-xs text-muted-foreground" style={{ paddingBottom: '5px' }}>—</span>;
                  }
                  return (
                    <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: f.badgeColor || '#10B981',
                          color: f.badgeColor ? darkenColor(f.badgeColor) : '#047857',
                          fontSize: '12px',
                          fontWeight: '600',
                          borderRadius: '4px',
                          whiteSpace: 'nowrap',
                          display: 'inline-block',
                          lineHeight: '1.2',
                          minWidth: 'fit-content',
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  );
                }
              }
              if (f.ui === 'italic') {
                return (
                  <span key={idx} className="text-xs text-muted-foreground italic" style={{ paddingBottom: '5px' }}>
                    {v}
                  </span>
                );
              }
              if (f.ui === 'slug') {
                return (
                  <span key={idx} className="text-xs text-muted-foreground" style={{ paddingBottom: '5px' }}>
                    {v}
                  </span>
                );
              }
              if (f.ui === 'custom' && Array.isArray(v)) {
                return (
                  <div key={idx} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: '5px' }}>
                    {v.map((item: any, j: number) => (
                      <span
                        key={j}
                        style={{
                          fontSize: 12,
                          padding: '4px 8px',
                          background: '#f4f4f4',
                          borderRadius: 6,
                          color: '#333',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                );
              }
              // default text
              return (
                <span key={idx} className="text-sm" style={{ paddingBottom: '5px' }}>
                  {v}
                </span>
              );
            })}
          </div>
        );
      },
      enableSorting: true,
      enableResizing: true,
      ...(cfg.width ? { size: cfg.width } : {}),
      meta: {
        cellClassName: '',
      },
    } as ColumnDef<any>;
  });
};

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
 * Helper to format date in "Oct 10, 2023 02:15 PM" format
 */
const formatDate = (timestamp: string | number | Date): string => {
  const date = new Date(timestamp);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12 || 12; // Convert 0 to 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  
  return `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

/**
 * Helper to calculate relative time from timestamp
 */
const getRelativeTime = (timestamp: string | number | Date): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  } else if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  } else if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
};

/**
 * Clock icon component
 */
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <g clip-path="url(#clip0_80_1652)">
      <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#676A72" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 3V6L8 7" stroke="#676A72" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_80_1652">
        <rect width="12" height="12" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

// Child row arrow icon
const ChildArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 2V14L12 8L4 2Z" fill="#8E9198" fill-opacity="0.3"/>
  </svg>
);

/**
 * Helper function to get status badge styling
 */
const getStatusBadgeStyle = (value: string) => {
  const normalizedValue = value?.toString().toLowerCase().trim();
  
  switch (normalizedValue) {
    case 'good':
      return {
        backgroundColor: '#E6F7ED',
        color: '#0D8446',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      };
    case 'bad':
      return {
        backgroundColor: '#FEE',
        color: '#C41230',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      };
    case 'ok':
      return {
        backgroundColor: '#FEF6E7',
        color: '#8F6400',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      };
    default:
      return {
        backgroundColor: '#F3F4F6',
        color: '#6B7280',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      };
  }
};

/**
 * Helper to get dynamic icon based on icon type and value
 */
const getDynamicIcon = (iconType: string | undefined, value: any): React.ReactNode => {
  if (!iconType || !value) return null;
  
  switch (iconType) {
    case 'status':
      if (value === 'Published') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_80_1673)">
              <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8C14.6666 4.3181 11.6818 1.33333 7.99992 1.33333C4.31802 1.33333 1.33325 4.3181 1.33325 8C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#0D8446" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 8.00001L7.33333 9.33334L10 6.66667" stroke="#0D8446" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_80_1673">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      } else if (value === 'Scheduled') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_80_1695)">
              <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#0084FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 4V8L10.6667 9.33333" stroke="#0084FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_80_1695">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      } else if (value === 'Draft') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#676A72" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        );
      }
      return null;
    case 'publication':
      // Handle publication status with custom icons
      if (value === 'Published') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_80_1673)">
              <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8C14.6666 4.3181 11.6818 1.33333 7.99992 1.33333C4.31802 1.33333 1.33325 4.3181 1.33325 8C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#0D8446" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 8.00001L7.33333 9.33334L10 6.66667" stroke="#0D8446" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_80_1673">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      } else if (value === 'Scheduled') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_80_1695)">
              <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#0084FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 4V8L10.6667 9.33333" stroke="#0084FF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_80_1695">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        );
      } else if (value === 'Draft') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334C4.31802 1.33334 1.33325 4.31811 1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z" stroke="#676A72" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        );
      }
      return null;
    default:
      return null;
  }
};

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
        // Check if this is a child row (has parentId)
        const isChildRow = row.original.parentId;
        
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
              // Add padding for child rows
              ...(isChildRow && cfg.id === 'title' 
                ? { paddingLeft: '24px' } 
                : {}),
            }}
          >
            {vals.map((v, idx) => {
              const f = cfg.fields[idx];
              
              // For child rows in the first column, add arrow icon
              const isChildFirstColumn = isChildRow && cfg.id === 'title' && idx === 0;
              
              // Check if this field should be grouped with previous avatar field
              const shouldGroupWithAvatar = idx > 0 && cfg.fields[idx - 1]?.ui === 'avatar' && f.ui !== 'avatar';
              
              // Check if this field should be grouped with previous publication status field
              const shouldGroupWithPublication = idx > 0 && cfg.fields[idx - 1]?.ui === 'text' && 
                                                cfg.fields[idx - 1]?.iconType === 'publication' && 
                                                f.ui !== 'text';
              
              if (shouldGroupWithAvatar) {
                // This field should be rendered in the same row as the previous avatar
                return null; // Skip individual rendering, will be handled by avatar field
              }
              
              if (shouldGroupWithPublication) {
                // This field should be rendered in the same row as the previous publication status
                return null; // Skip individual rendering, will be handled by publication status field
              }
              
              if (f.ui === 'avatar') {
                // Check if there are subsequent text fields to group with this avatar
                const subsequentFields = [];
                const subsequentValues = [];
                
                for (let i = idx + 1; i < cfg.fields.length; i++) {
                  const nextField = cfg.fields[i];
                  const nextValue = vals[i];
                  
                  // Group non-avatar fields that come after this avatar
                  if (nextField.ui !== 'avatar') {
                    subsequentFields.push(nextField);
                    subsequentValues.push(nextValue);
                  } else {
                    break; // Stop at next avatar
                  }
                }
                
                // Get avatar path from data
                const avatarPath = v && typeof v === 'string' && v.startsWith('/media/') ? v : null;
                
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '8px', paddingBottom: '5px', width: '100%' }}>
                    {/* Image column - centered */}
                    <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3px' }}>
                      {avatarPath ? (
                        <img
                          src={avatarPath}
                          alt="avatar"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#6B7280',
                          }}
                        >
                          {v ? String(v).charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    {/* Text column with all grouped fields */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      {/* Avatar name - only show if not an image path */}
                      {!avatarPath && (
                        <span className="text-sm" style={{ paddingBottom: '5px' }}>{v}</span>
                      )}
                      
                      {/* Subsequent text fields */}
                      {subsequentFields.map((subField, subIdx) => {
                        const subValue = subsequentValues[subIdx];
                        
                        if (subField.ui === 'text') {
                          return (
                            <span key={subIdx} className="text-sm" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {subField.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{subField.icon}</span>}
                              {subValue}
                            </span>
                          );
                        }
                        
                        if (subField.ui === 'time') {
                          return (
                            <span key={subIdx} className="text-sm text-muted-foreground" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ClockIcon />
                              {getRelativeTime(subValue)}
                            </span>
                          );
                        }
                        
                        if (subField.ui === 'date') {
                          return (
                            <span key={subIdx} className="text-sm text-muted-foreground" style={{ paddingBottom: '5px' }}>
                              {formatDate(subValue)}
                            </span>
                          );
                        }
                        
                        // Handle other UI types for grouped fields
                        return (
                          <span key={subIdx} className="text-sm" style={{ paddingBottom: '5px' }}>
                            {subValue}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              
              // Skip fields that were grouped with avatar (they're already rendered above)
              const hasPreviousAvatar = cfg.fields.slice(0, idx).some(prevField => prevField.ui === 'avatar');
              if (hasPreviousAvatar) {
                return null;
              }
              
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
                    <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px', alignItems: 'center' }}>
                      {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                      {getDynamicIcon(f.iconType, v)}
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
                    <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px', alignItems: 'center' }}>
                      {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                      {getDynamicIcon(f.iconType, v)}
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
              if (f.ui === 'status-badge') {
                if (v == null) {
                  return <span key={idx} className="text-xs text-muted-foreground" style={{ paddingBottom: '5px' }}>—</span>;
                }
                return (
                  <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px', alignItems: 'center' }}>
                    {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                    <span
                      style={getStatusBadgeStyle(v)}
                    >
                      {v}
                    </span>
                  </div>
                );
              }
              if (f.ui === 'italic') {
                return (
                  <span key={idx} className="text-xs text-muted-foreground italic" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                    {v}
                  </span>
                );
              }
              if (f.ui === 'slug') {
                return (
                  <span key={idx} className="text-xs text-muted-foreground" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                    {v}
                  </span>
                );
              }
              if (f.ui === 'time') {
                return (
                  <span key={idx} className="text-sm text-muted-foreground" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ClockIcon />
                    {getRelativeTime(v)}
                  </span>
                );
              }
              if (f.ui === 'date') {
                return (
                  <span key={idx} className="text-sm text-muted-foreground" style={{ paddingBottom: '5px' }}>
                    {formatDate(v)}
                  </span>
                );
              }
              if (f.ui === 'strong-text') {
                return (
                  <span key={idx} className="text-sm font-semibold" style={{ 
                    paddingBottom: '5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: '#2C2D30',

                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: '1.3125rem'
                  }}>
                    {/* Add arrow icon for child rows in first column */}
                    {isChildFirstColumn && <ChildArrowIcon />}
                    {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                    {v}
                  </span>
                );
              }
              
              if (f.ui === 'strong-number' && typeof v === 'number') {
                return (
                  <div key={idx} style={{ display: 'inline-flex', gap: '4px', flexWrap: 'wrap', position: 'relative', paddingBottom: '5px', alignItems: 'center' }}>
                  <span key={idx} className="text-sm text-muted-foreground font-semibold  " style={{ 
                    paddingBottom: '5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    color: '#2C2D30',
                    backgroundColor: '#E5E7EB',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    lineHeight: '1.3125rem'
                  }}>
                    {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
                    {v}
                  </span>
                  </div>
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
              // default text with optional icon
              const dynamicIcon = getDynamicIcon(f.iconType, v);
              if (dynamicIcon) {
                // If there's a dynamic icon, create two-column layout like avatar
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingBottom: '5px', width: '100%' }}>
                    {/* Icon column */}
                    <div style={{ flexShrink: 0, paddingTop: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {getDynamicIcon(f.iconType, v)}
                      </div>
                    </div>
                    {/* Text column with grouped fields */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      {/* Publication status */}
                      <span className="text-sm" style={{ paddingBottom: '5px' }}>{v}</span>
                    </div>
                  </div>
                );
              }
              // Regular text with optional static icon
              return (
                <span key={idx} className="text-sm" style={{ paddingBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {f.icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{f.icon}</span>}
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

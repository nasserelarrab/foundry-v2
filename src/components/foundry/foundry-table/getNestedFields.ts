export type FieldInfo = {
  path: string;      // dot notation path, e.g. "seo.label"
  label: string;     // user-friendly label
  type: string;      // data type (string, number, date, boolean)
  group?: string;    // top-level group (e.g., "seo", "updated")
};

export function getNestedFields(obj: any, parentPath = '', parentLabel = ''): FieldInfo[] {
  const fields: FieldInfo[] = [];

  // Special handling for child array – add a count field
  if (parentPath === '' && obj && 'child' in obj) {
    fields.push({
      path: 'childCount',
      label: 'Child Pages (count)',
      type: 'number',
      group: 'children',
    });
  }

  if (!obj || typeof obj !== 'object') return fields;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = parentPath ? `${parentPath}.${key}` : key;
    const currentLabel = parentLabel ? `${parentLabel} ${key}` : key;
    // Determine group: for nested paths, group is the top-level key (first part)
    const group = parentPath ? parentPath.split('.')[0] : key;

    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Add a length field for the array itself
        fields.push({
          path: `${currentPath}.length`,
          label: `${currentLabel} (count)`,
          type: 'number',
          group,
        });
        // Recurse into first element if it's an object (to expose deeper fields)
        if (value.length > 0 && typeof value[0] === 'object') {
          fields.push(...getNestedFields(value[0], currentPath, currentLabel));
        }
      } else {
        // Recurse into nested object
        fields.push(...getNestedFields(value, currentPath, currentLabel));
      }
    } else {
      // Leaf value
      fields.push({
        path: currentPath,
        label: currentLabel,
        type: typeof value as any,
        group,
      });
    }
  }
  return fields;
}
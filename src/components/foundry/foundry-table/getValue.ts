export const getValue = (row: any, path?: string): any => {
  if (!path) return undefined;
  return path.split('.').reduce((o, key) => (o ? o[key] : undefined), row);
};
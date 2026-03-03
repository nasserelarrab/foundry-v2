// this file exists so that other parts of the app can import
// from `@/pages/modules` without knowing the internal component path.
// the actual implementation lives in `./component/pages-list`, which now
// defaults its own column configuration using `pages-list-table.config.ts`.

export { default } from './component/pages-list';
export { default as PagesList } from './component/pages-list';

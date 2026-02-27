import type { ComponentType } from 'react';

export type Layout16SecondarySection =
  | 'primary'
  | 'workspaces'
  | 'communities'
  | 'resources';

export interface Layout16SecondaryItem {
  id: string;
  title: string;
  path: string;
  section: Layout16SecondarySection;
  icon?: ComponentType<{ className?: string }>;
  enabled?: boolean;
  badge?: string;
}

export interface Layout16ModuleConfig {
  id: string;
  title: string;
  tooltip: string;
  icon: ComponentType<{ className?: string }>;
  path: string;
  rootPath: string;
  enabled?: boolean;
  secondaryItems: Layout16SecondaryItem[];
}

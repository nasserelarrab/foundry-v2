import { Delivery2 } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Boxes, Folder, Users, Sparkles } from 'lucide-react';

export const INVENTORY_MODULE: Layout16ModuleConfig = {
  id: 'inventory',
  title: 'Inventory',
  tooltip: 'Inventory',
  icon: Delivery2,
  path: '#',
  rootPath: '#',
  enabled: true,
  secondaryItems: [
    {
      id: 'inventory-1',
      title: 'Inventory 1',
      path: '#',
      section: 'primary',
      icon: Boxes,
      enabled: true,
    },
    {
      id: 'inventory-ws-1',
      title: 'Inventory Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'inventory-com-1',
      title: 'Inventory Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'inventory-res-1',
      title: 'Inventory Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: false,
    },
  ],
};

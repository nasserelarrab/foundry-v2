import { Shop } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { ShoppingBag, Folder, Users, Sparkles } from 'lucide-react';

export const ECOMMERCE_MODULE: Layout16ModuleConfig = {
  id: 'ecommerce',
  title: 'E-commerce',
  tooltip: 'E-commerce',
  icon: Shop,
  path: '/layout-16/modules/ecommerce',
  rootPath: '/layout-16/modules/ecommerce',
  enabled: true,
  secondaryItems: [
    {
      id: 'ecommerce-1',
      title: 'E-commerce 1',
      path: '#',
      section: 'primary',
      icon: ShoppingBag,
      enabled: true,
    },
    {
      id: 'ecommerce-ws-1',
      title: 'E-commerce Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'ecommerce-com-1',
      title: 'E-commerce Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'ecommerce-res-1',
      title: 'E-commerce Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: false,
    },
  ],
};

import { GroupMinus } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Calculator, Folder, Users, Sparkles } from 'lucide-react';

export const BOOKKEEPING_MODULE: Layout16ModuleConfig = {
  id: 'bookkeeping',
  title: 'Bookkeeping',
  tooltip: 'Bookkeeping',
  icon: GroupMinus,
  path: '#',
  rootPath: '#',
  enabled: true,
  secondaryItems: [
    {
      id: 'bookkeeping-1',
      title: 'Bookkeeping 1',
      path: '#',
      section: 'primary',
      icon: Calculator,
      enabled: true,
    },
    {
      id: 'bookkeeping-ws-1',
      title: 'Bookkeeping Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'bookkeeping-com-1',
      title: 'Bookkeeping Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'bookkeeping-res-1',
      title: 'Bookkeeping Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: true,
      badge: 'Test',
    },
  ],
};

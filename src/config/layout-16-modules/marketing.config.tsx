import { GraphUp } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Megaphone, Folder, Users, Sparkles } from 'lucide-react';

export const MARKETING_MODULE: Layout16ModuleConfig = {
  id: 'marketing',
  title: 'Marketing',
  tooltip: 'Marketing',
  icon: GraphUp,
  path: '/layout-16/modules/marketing',
  rootPath: '/layout-16/modules/marketing',
  enabled: true,
  secondaryItems: [
    {
      id: 'marketing-1',
      title: 'Marketing 1',
      path: '#',
      section: 'primary',
      icon: Megaphone,
      enabled: true,
    },
    {
      id: 'marketing-ws-1',
      title: 'Marketing Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'marketing-com-1',
      title: 'Marketing Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'marketing-res-1',
      title: 'Marketing Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: true,
    },
  ],
};

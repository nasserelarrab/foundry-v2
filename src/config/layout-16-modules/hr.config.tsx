import { People } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { UserCog, Folder, Users, Sparkles } from 'lucide-react';

export const HR_MODULE: Layout16ModuleConfig = {
  id: 'hr',
  title: 'Human Resources',
  tooltip: 'Human Resources',
  icon: People,
  path: '/layout-16/modules/hr',
  rootPath: '/layout-16/modules/hr',
  enabled: true,
  secondaryItems: [
    {
      id: 'hr-1',
      title: 'HR 1',
      path: '#',
      section: 'primary',
      icon: UserCog,
      enabled: true,
    },
    {
      id: 'hr-ws-1',
      title: 'HR Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'hr-com-1',
      title: 'HR Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'hr-res-1',
      title: 'HR Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: true,
    },
  ],
};

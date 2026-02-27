import { Data } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Kanban, Folder, Users, Sparkles } from 'lucide-react';

export const PM_MODULE: Layout16ModuleConfig = {
  id: 'pm',
  title: 'Project Management',
  tooltip: 'Project Management',
  icon: Data,
  path: '#',
  rootPath: '#',
  enabled: true,
  secondaryItems: [
    {
      id: 'pm-1',
      title: 'PM 1',
      path: '#',
      section: 'primary',
      icon: Kanban,
      enabled: true,
    },
    {
      id: 'pm-ws-1',
      title: 'PM Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'pm-com-1',
      title: 'PM Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'pm-res-1',
      title: 'PM Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: false,
    },
  ],
};

import { CalendarAdd } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Folder, Users, Sparkles, Settings } from 'lucide-react';

export const CALENDAR_MODULE: Layout16ModuleConfig = {
  id: 'calendar',
  title: 'Calendar',
  tooltip: 'Calinder',
  icon: CalendarAdd,
  path: '/layout-16/modules/calendar',
  rootPath: '/layout-16/modules/calendar',
  enabled: true,
  secondaryItems: [
    {
      id: 'calendar-1',
      title: 'Calendar 1',
      path: '#',
      section: 'primary',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'calendar-2',
      title: 'Calendar 2',
      path: '#',
      section: 'primary',
      icon: Settings,
      enabled: true,
    },
    {
      id: 'calendar-ws-1',
      title: 'Calendar Workspace',
      path: '#',
      section: 'workspaces',
      icon: Sparkles,
      enabled: true,
    },
    {
      id: 'calendar-com-1',
      title: 'Calendar Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'calendar-res-1',
      title: 'Calendar Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: false,
    },
  ],
};

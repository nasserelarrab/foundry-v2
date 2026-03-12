import { BookUser, Contact, Folder, Sparkles, Users } from 'lucide-react';
import type { Layout16ModuleConfig } from './types';

export const CRM_MODULE: Layout16ModuleConfig = {
  id: 'crm',
  title: 'CRM',
  tooltip: 'CRM',
  icon: BookUser,
  path: '/layout-16/modules/crm',
  rootPath: '/layout-16/modules/crm',
  enabled: true,
  secondaryItems: [
    {
      id: 'crm-1',
      title: 'CRM 1',
      path: '#',
      section: 'primary',
      icon: Contact,
      enabled: true,
    },
    {
      id: 'crm-ws-1',
      title: 'CRM Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'crm-com-1',
      title: 'CRM Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'crm-res-1',
      title: 'CRM Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: false,
    },
  ],
};

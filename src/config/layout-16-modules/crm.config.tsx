import { AddressBook } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { Sparkles, Folder, Users, Contact } from 'lucide-react';

export const CRM_MODULE: Layout16ModuleConfig = {
  id: 'crm',
  title: 'CRM',
  tooltip: 'CRM',
  icon: AddressBook,
  path: '#',
  rootPath: '#',
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

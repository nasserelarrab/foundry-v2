import { Document } from '@/components/icons';
import type { Layout16ModuleConfig } from './types';
import { FileText, Folder, Users, Sparkles } from 'lucide-react';

export const CMS_MODULE: Layout16ModuleConfig = {
  id: 'cms',
  title: 'CMS',
  tooltip: 'CMS',
  icon: Document,
  path: '#',
  rootPath: '#',
  enabled: true,
  secondaryItems: [
    {
      id: 'cms-1',
      title: 'CMS1',
      path: '#',
      section: 'primary',
      icon: FileText,
      enabled: true,
    },
    {
      id: 'cms-2',
      title: 'CMS2',
      path: '#',
      section: 'primary',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'cms-3',
      title: 'CMS3',
      path: '#',
      section: 'primary',
      icon: Sparkles,
      enabled: false,
    },
    {
      id: 'cms-ws-1',
      title: 'CMS Workspace',
      path: '#',
      section: 'workspaces',
      icon: Folder,
      enabled: true,
    },
    {
      id: 'cms-com-1',
      title: 'CMS Community',
      path: '#',
      section: 'communities',
      icon: Users,
      enabled: true,
    },
    {
      id: 'cms-res-1',
      title: 'CMS Resource',
      path: '#',
      section: 'resources',
      icon: Sparkles,
      enabled: true,
      badge: 'New',
    },
  ],
};

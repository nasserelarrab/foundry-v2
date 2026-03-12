import { ShieldUser, Users } from 'lucide-react';
import type { Layout16ModuleConfig } from './types';

export const USER_MODULE: Layout16ModuleConfig = {
  id: 'user_management',
  title: 'User Management',
  tooltip: 'User Management',
  icon: ShieldUser,
  path: '/user-management/users',
  rootPath: '/user-management/users',
  enabled: true,
  secondaryItems: [
    {
      id: 'users-list',
      title: 'Users',
      path: '/user-management/users',
      section: 'primary',
      icon: Users,
      enabled: true,
    },
  ],
};

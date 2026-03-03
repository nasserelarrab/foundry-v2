'use client';

import { FoundryTable } from './foundry-table';
import { ColumnConfig } from './column-config';

// Example data structure
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
}

// Example configuration for users table
const USERS_TABLE_CONFIG: ColumnConfig[] = [
  {
    id: 'user',
    header: 'User',
    fields: [
      { path: 'name', ui: 'text' },
      { path: 'email', ui: 'slug' },
    ],
    flex: true,
  },
  {
    id: 'role',
    header: 'Role',
    fields: [{ path: 'role', ui: 'badge', badgeColor: '#3B82F6' }],
    width: '120px',
  },
  {
    id: 'status',
    header: 'Status',
    fields: [{ path: 'status', ui: 'badge', badgeColor: '#10B981' }],
    width: '120px',
  },
  {
    id: 'lastLogin',
    header: 'Last Login',
    fields: [{ path: 'lastLogin', ui: 'text' }],
    width: '150px',
  },
];

// Example data
const usersData: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2 hours ago',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '1 day ago',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Pending',
    lastLogin: '3 days ago',
  },
];

// Example actions cell component
function UserActionsCell({ row }: { row: any }) {
  return (
    <div className="flex gap-2">
      <button className="text-blue-600 hover:text-blue-800">Edit</button>
      <button className="text-red-600 hover:text-red-800">Delete</button>
    </div>
  );
}

// Example usage component
export function UsersTableExample() {
  return (
    <FoundryTable<User>
      columnConfig={USERS_TABLE_CONFIG}
      data={usersData}
      ActionsCell={UserActionsCell}
      showCheckbox={true}
      defaultSorting={[{ id: 'name', desc: false }]}
      defaultPagination={{ pageIndex: 0, pageSize: 5 }}
    />
  );
}

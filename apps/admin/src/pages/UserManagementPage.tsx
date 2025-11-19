import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { components } from '@repo/api-client';
import { DataTable, TableToolbar, Column, COLUMN_CELL_TYPE, Button, Badge } from '@repo/ui';
import { fetchClient } from '../api/client';
import { UserDialog } from '../components/user/UserDialog';
import { DeleteUserDialog } from '../components/user/DeleteUserDialog';

type UserResponse = components['schemas']['UserResponse'];

const ROLE_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ADMIN: 'destructive',
  MANAGER: 'default',
  WAITER: 'secondary',
  COOK: 'outline',
  DRIVER: 'outline',
};

export function UserManagementPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserResponse | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch users with pagination
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/users', {
        params: {
          query: {
            page,
            size: pageSize,
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch users');
      }

      return data;
    },
  });

  // Define columns with type-safe paths
  const columns: Column<UserResponse>[] = [
    {
      id: 'username',
      label: 'Username',
      type: COLUMN_CELL_TYPE.TEXT,
      enableSorting: true,
    },
    {
      id: 'firstName',
      label: 'First Name',
      type: COLUMN_CELL_TYPE.TEXT,
      enableSorting: true,
      noDataFallback: '-',
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: COLUMN_CELL_TYPE.TEXT,
      enableSorting: true,
      noDataFallback: '-',
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      type: COLUMN_CELL_TYPE.TEXT,
      noDataFallback: '-',
    },
    {
      id: 'role',
      label: 'Role',
      type: COLUMN_CELL_TYPE.COMPONENT,
      render: (role) => (
        <Badge variant={ROLE_COLORS[role as string] || 'default'}>{role as string}</Badge>
      ),
      enableSorting: true,
    },
    {
      id: 'id',
      label: 'Actions',
      type: COLUMN_CELL_TYPE.COMPONENT,
      render: (_, user) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setEditingUser(user);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit user</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingUser(user);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete user</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2 text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage users and their roles</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search users..."
            showSearchInfo={true}
            searchInfoMessage="Search filters data on the current page. Increase page size to search across more users."
          />
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={data?.content}
          loading={isLoading}
          fetching={isFetching}
          noDataMessage="No users found."
          pagination={
            data
              ? {
                  page,
                  pageSize,
                  total: data.totalElements || 0,
                }
              : undefined
          }
          onPaginationChange={({ page, pageSize }) => {
            setPage(page);
            setPageSize(pageSize);
          }}
          searchQuery={searchQuery}
        />
      </div>

      {/* Create/Edit Dialog */}
      <UserDialog
        open={isCreateDialogOpen || !!editingUser}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingUser(null);
          }
        }}
        user={editingUser}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={!!deletingUser}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDeletingUser(null);
          }
        }}
        user={deletingUser}
      />
    </div>
  );
}

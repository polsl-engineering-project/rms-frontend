import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import { DataTable, TableToolbar, Button, Plus } from '@repo/ui';
import { fetchClient } from '../../api/client';
import { createUserColumns } from './UserTable.config';
import { useAuthStore } from '../../stores/auth';

type UserResponse = components['schemas']['UserResponse'];

type UserTableProps = {
  onCreateUser: () => void;
  onEditUser: (user: UserResponse) => void;
  onDeleteUser: (user: UserResponse) => void;
  onChangePassword: (user: UserResponse) => void;
};

export function UserTable({
  onCreateUser,
  onEditUser,
  onDeleteUser,
  onChangePassword,
}: UserTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useAuthStore((state) => state.user);

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

  // Count admin users
  const adminCount = data?.content?.filter((user) => user.role === 'ADMIN').length || 0;

  const columns = createUserColumns({
    onEdit: onEditUser,
    onDelete: onDeleteUser,
    onChangePassword: onChangePassword,
    currentUser,
    adminCount,
  });

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search users..."
          showSearchInfo={true}
          searchInfoMessage="Search filters data on the current page. Increase page size to search across more users."
        />
        <Button onClick={onCreateUser}>
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
  );
}

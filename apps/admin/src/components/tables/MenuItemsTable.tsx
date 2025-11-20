import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import { DataTable, TableToolbar, Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { fetchClient } from '../../api/client';
import { createMenuItemColumns } from './MenuItemsTable.config';

type MenuItemResponse = components['schemas']['MenuItemResponse'];
type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];

type MenuItemsTableProps = {
  onCreateItem: () => void;
  onEditItem: (item: MenuItemResponse) => void;
  onDeleteItem: (item: MenuItemResponse) => void;
};

export function MenuItemsTable({ onCreateItem, onEditItem, onDeleteItem }: MenuItemsTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['menu-items', page, pageSize],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/item', {
        params: {
          query: {
            page,
            size: pageSize,
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch menu items');
      }

      return data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['menu-categories-all'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/category', {
        params: {
          query: {
            page: 0,
            size: 1000,
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch categories');
      }

      return data;
    },
  });

  const categoriesMap = new Map<string, MenuCategoryResponse>();
  categoriesData?.content?.forEach((category) => {
    if (category.id) {
      categoriesMap.set(category.id, category);
    }
  });

  const columns = createMenuItemColumns({
    onEdit: onEditItem,
    onDelete: onDeleteItem,
    categoriesMap,
  });

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search items..."
          showSearchInfo={true}
          searchInfoMessage="Search filters data on the current page."
        />
        <Button onClick={onCreateItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.content}
        loading={isLoading}
        fetching={isFetching}
        noDataMessage="No menu items found."
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

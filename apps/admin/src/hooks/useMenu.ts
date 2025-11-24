import { $api } from '../api/client';

export function useCategories() {
  return $api.useQuery('get', '/api/v1/menu/category', {
    params: {
      query: {
        size: 100,
        sortDirection: 'ASC',
        sortBy: 'ORDER',
      },
    },
  });
}

export function useMenuItems(categoryId?: string, search?: string) {
  return $api.useQuery('get', '/api/v1/menu/item', {
    params: {
      query: {
        categoryId,
        search,
        size: 100,
        sortDirection: 'ASC',
        sortBy: 'NAME',
      },
    },
  });
}

export function useAddItemsToBill() {
  const { mutateAsync, ...rest } = $api.useMutation('post', '/api/v1/bills/{id}/add-items');
  return { mutateAsync, ...rest };
}

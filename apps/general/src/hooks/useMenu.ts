import { useQuery } from '@tanstack/react-query';
import { fetchClient } from '../api/client';

export function useMenu(selectedCategoryId: string | null) {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/category', {
        params: {
          query: {
            page: 0,
            size: 100,
          },
        },
      });
      if (error) throw new Error('Failed to fetch categories');
      return data;
    },
  });

  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ['menuItems', selectedCategoryId],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/item', {
        params: {
          query: {
            page: 0,
            size: 100,
          },
        },
      });
      if (error) throw new Error('Failed to fetch menu items');
      return data;
    },
    enabled: !!selectedCategoryId,
  });

  const activeCategories = categoriesData?.content?.filter((cat) => cat.active) || [];
  const menuItems =
    itemsData?.content?.filter((item) => item.categoryId === selectedCategoryId) || [];

  return {
    categoriesData,
    categoriesLoading,
    itemsData,
    itemsLoading,
    activeCategories,
    menuItems,
  };
}

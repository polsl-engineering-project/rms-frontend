import { useMutation } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { MenuCategoryForm, type MenuCategoryFormValues } from '../forms/MenuCategoryForm';

type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];
type CreateMenuCategoryRequest = components['schemas']['CreateMenuCategoryRequest'];
type UpdateMenuCategoryRequest = components['schemas']['UpdateMenuCategoryRequest'];

type MenuCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategoryResponse | null;
};

export function MenuCategoryDialog({ open, onOpenChange, category }: MenuCategoryDialogProps) {
  const isEdit = !!category;

  const createMutation = useMutation({
    mutationFn: async (data: CreateMenuCategoryRequest) => {
      const { data: responseData, error } = await fetchClient.POST('/api/v1/menu/category', {
        body: data,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create category');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-all'] });
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CreateMenuCategoryRequest) => {
      if (!category?.id) {
        throw new Error('Category ID is required for update');
      }

      const updateData: UpdateMenuCategoryRequest = {
        ...data,
        id: category.id,
      };

      const { error } = await fetchClient.PUT('/api/v1/menu/category/{id}', {
        params: {
          path: {
            id: category.id,
          },
        },
        body: updateData,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update category');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-all'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (values: MenuCategoryFormValues) => {
    const { submit: _submit, ...categoryData } = values;
    if (isEdit) {
      updateMutation.mutate(categoryData);
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update category information.' : 'Add a new category to the menu.'}
          </DialogDescription>
        </DialogHeader>

        <MenuCategoryForm
          category={category}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          open={open}
        />
      </DialogContent>
    </Dialog>
  );
}

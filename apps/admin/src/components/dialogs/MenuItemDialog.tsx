import { useMutation } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, toast } from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { MenuItemForm, type MenuItemFormValues } from '../forms/MenuItemForm';

type MenuItemResponse = components['schemas']['MenuItemResponse'];
type CreateMenuItemRequest = components['schemas']['CreateMenuItemRequest'];
type UpdateMenuItemRequest = components['schemas']['UpdateMenuItemRequest'];

type MenuItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItemResponse | null;
};

export function MenuItemDialog({ open, onOpenChange, item }: MenuItemDialogProps) {
  const isEdit = !!item;

  const createMutation = useMutation({
    mutationFn: async (data: CreateMenuItemRequest) => {
      const { data: responseData, error } = await fetchClient.POST('/api/v1/menu/item', {
        body: data,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create menu item');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item created successfully');
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CreateMenuItemRequest) => {
      if (!item?.id) {
        throw new Error('Item ID is required for update');
      }

      const updateData: UpdateMenuItemRequest = {
        ...data,
        id: item.id,
      };

      const { error } = await fetchClient.PUT('/api/v1/menu/item/{id}', {
        params: {
          path: {
            id: item.id,
          },
        },
        body: updateData,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update menu item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item updated successfully');
      onOpenChange(false);
    },
  });

  const handleSubmit = (values: MenuItemFormValues) => {
    const { submit: _submit, ...itemData } = values;
    if (isEdit) {
      updateMutation.mutate(itemData);
    } else {
      createMutation.mutate(itemData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Menu Item' : 'Create New Menu Item'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update menu item information.' : 'Add a new item to the menu.'}
          </DialogDescription>
        </DialogHeader>

        <MenuItemForm
          item={item}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          open={open}
        />
      </DialogContent>
    </Dialog>
  );
}

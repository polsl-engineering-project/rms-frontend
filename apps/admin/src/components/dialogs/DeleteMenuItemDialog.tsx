import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  toast,
} from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';

type MenuItemResponse = components['schemas']['MenuItemResponse'];

type DeleteMenuItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItemResponse | null;
};

export function DeleteMenuItemDialog({ open, onOpenChange, item }: DeleteMenuItemDialogProps) {
  const [error, setError] = useState<string>('');

  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await fetchClient.DELETE('/api/v1/menu/item/{id}', {
        params: {
          path: {
            id: itemId,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete menu item');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Menu item deleted successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleDelete = () => {
    if (!item?.id) return;
    setError('');
    deleteMutation.mutate(item.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this menu item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{item?.name}</span>
            </div>
            {item?.description && (
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span className="text-right">{item.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Price:</span>
              <span>${item?.price?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

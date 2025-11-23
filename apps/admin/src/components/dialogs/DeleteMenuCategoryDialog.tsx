import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Alert,
  AlertDescription,
  toast,
} from '@repo/ui';
import { AlertTriangle } from 'lucide-react';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';

type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];

type DeleteMenuCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategoryResponse | null;
};

export function DeleteMenuCategoryDialog({
  open,
  onOpenChange,
  category,
}: DeleteMenuCategoryDialogProps) {
  const [error, setError] = useState<string>('');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const HOLD_DURATION = 2000; // 2 seconds to hold

  // Fetch category with items to get the count
  const { data: categoryWithItems } = useQuery({
    queryKey: ['menu-category-detail', category?.id],
    queryFn: async () => {
      if (!category?.id) return null;

      const { data, error } = await fetchClient.GET('/api/v1/menu/category/{id}', {
        params: {
          path: {
            id: category.id,
          },
          query: {
            withItems: true,
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch category details');
      }

      return data;
    },
    enabled: open && !!category?.id,
  });

  const itemCount = categoryWithItems?.items?.length || 0;
  const hasItems = itemCount > 0;

  // Reset hold progress when dialog closes or category changes
  useEffect(() => {
    if (!open) {
      setHoldProgress(0);
      setIsHolding(false);
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [open, category?.id]);

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await fetchClient.DELETE('/api/v1/menu/category/{id}', {
        params: {
          path: {
            id: categoryId,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete category');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
      queryClient.invalidateQueries({ queryKey: ['menu-categories-all'] });
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
      toast.success('Category deleted successfully');
      onOpenChange(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleMouseDown = () => {
    if (!category?.id) return;
    setError('');

    // If no items, delete immediately
    if (!hasItems) {
      deleteMutation.mutate(category.id);
      return;
    }

    // Has items, require holding
    setIsHolding(true);
    setHoldProgress(0);

    // Progress animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 16); // ~60fps

    // Delete after hold duration
    holdTimerRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsHolding(false);
      setHoldProgress(0);
      if (category.id) {
        deleteMutation.mutate(category.id);
      }
    }, HOLD_DURATION);
  };

  const handleMouseUp = () => {
    if (!hasItems) return;

    setIsHolding(false);
    setHoldProgress(0);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (isHolding) {
      handleMouseUp();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{category?.name}</span>
            </div>
            {category?.description && (
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span className="text-right">{category.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span>{category?.active ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Menu Items:</span>
              <span className={itemCount > 0 ? 'font-semibold text-destructive' : ''}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {hasItems && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This category contains {itemCount} menu {itemCount === 1 ? 'item' : 'items'}.
                Deleting this category will permanently delete all items in it. Hold the delete
                button for 2 seconds to confirm.
              </AlertDescription>
            </Alert>
          )}
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
          <div className="relative">
            <Button
              variant="destructive"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              disabled={deleteMutation.isPending}
              className="relative overflow-hidden"
            >
              {hasItems && isHolding && (
                <div
                  className="absolute inset-0 bg-destructive-foreground/20 transition-all"
                  style={{ width: `${holdProgress}%` }}
                />
              )}
              <span className="relative z-10">
                {deleteMutation.isPending
                  ? 'Deleting...'
                  : hasItems
                    ? 'Hold to Delete'
                    : 'Delete Category'}
              </span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

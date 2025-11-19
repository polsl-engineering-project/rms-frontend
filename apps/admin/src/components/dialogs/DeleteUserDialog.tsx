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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { useAuthStore } from '../../stores/auth';

type UserResponse = components['schemas']['UserResponse'];

type DeleteUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
};

export function DeleteUserDialog({ open, onOpenChange, user }: DeleteUserDialogProps) {
  const [error, setError] = useState<string>('');
  const currentUser = useAuthStore((state) => state.user);
  const isSelf = currentUser?.id === user?.id;

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await fetchClient.DELETE('/api/v1/users/{id}', {
        params: {
          path: {
            id: userId,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleDelete = () => {
    if (!user?.id) return;
    setError('');
    deleteMutation.mutate(user.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-md bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Username:</span>
              <span>{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>
                {user?.firstName || user?.lastName
                  ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span>{user?.role}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending || isSelf}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
                  </Button>
                </span>
              </TooltipTrigger>
              {isSelf && (
                <TooltipContent>
                  <p>You cannot delete your own account</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useMutation } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, toast } from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { UserForm, type UserFormValues } from '../forms/UserForm';

type UserResponse = components['schemas']['UserResponse'];
type CreateUserRequest = components['schemas']['CreateUserRequest'];

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
};

export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
  const isEdit = !!user;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const { data: responseData, error } = await fetchClient.POST('/api/v1/users', {
        body: data,
      });

      if (error) {
        throw new Error(error.message || 'Failed to create user');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
      onOpenChange(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      if (!user?.id) {
        throw new Error('User ID is required for update');
      }

      const { data: responseData, error } = await fetchClient.PUT('/api/v1/users/{id}', {
        params: {
          path: {
            id: user.id,
          },
        },
        body: data,
      });

      if (error) {
        throw new Error(error.message || 'Failed to update user');
      }

      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
      onOpenChange(false);
    },
  });

  const handleSubmit = (values: UserFormValues) => {
    const { submit: _submit, ...userData } = values;
    if (isEdit) {
      updateMutation.mutate(userData);
    } else {
      createMutation.mutate(userData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user information and role.' : 'Add a new user to the system.'}
          </DialogDescription>
        </DialogHeader>

        <UserForm
          user={user}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          open={open}
        />
      </DialogContent>
    </Dialog>
  );
}

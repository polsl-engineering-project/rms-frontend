import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
} from '@repo/ui';
import { AlertTriangle } from 'lucide-react';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { FormikPasswordInput } from '../inputs';

type UserResponse = components['schemas']['UserResponse'];

type ChangeUserPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
};

const changeUserPasswordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm the password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  submit: Yup.string(), // For general form errors
});

export function ChangeUserPasswordDialog({
  open,
  onOpenChange,
  user,
}: ChangeUserPasswordDialogProps) {
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: async (password: string) => {
      if (!user?.id) {
        throw new Error('No user selected');
      }

      const { error } = await fetchClient.PATCH('/api/v1/users/{id}/change-password', {
        params: {
          path: {
            id: user.id,
          },
        },
        body: {
          password,
        },
      });

      if (error) {
        throw new Error('Failed to change password');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
      formik.resetForm();
    },
    onError: (err: Error) => {
      setError(err.message);
      formik.setFieldError('submit', err.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      submit: '',
    },
    validationSchema: changeUserPasswordSchema,
    onSubmit: async (values) => {
      setError('');
      await mutation.mutateAsync(values.password);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      formik.resetForm();
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change User Password</DialogTitle>
          <DialogDescription>
            Set a new password for {user?.username ? `${user.username}` : 'this user'}.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="default" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You are changing the password for{' '}
            <strong>
              {user?.firstName || user?.lastName
                ? `${user.firstName} ${user.lastName}`.trim()
                : user?.username}
            </strong>
            . This action will immediately update their account credentials.
          </AlertDescription>
        </Alert>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <FormikPasswordInput
              formik={formik}
              name="password"
              label="New Password"
              required
              disabled={mutation.isPending}
            />

            <FormikPasswordInput
              formik={formik}
              name="confirmPassword"
              label="Confirm Password"
              required
              disabled={mutation.isPending}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

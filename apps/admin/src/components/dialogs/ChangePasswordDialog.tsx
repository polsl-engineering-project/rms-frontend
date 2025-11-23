import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { useAuthStore } from '../../stores/auth';
import { FormikPasswordInput } from '../inputs';

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const changePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  submit: Yup.string(), // For general form errors
});

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [error, setError] = useState<string>('');
  const user = useAuthStore((state) => state.user);

  const mutation = useMutation({
    mutationFn: async (password: string) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
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
      toast.success('Password changed successfully');
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
      newPassword: '',
      confirmPassword: '',
      submit: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      setError('');
      await mutation.mutateAsync(values.newPassword);
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
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Choose a new password for your account.</DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4 py-4">
            <FormikPasswordInput
              formik={formik}
              name="newPassword"
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

import { useEffect } from 'react';
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
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { fetchClient } from '../../api/client';
import { queryClient } from '../../lib/queryClient';

type UserResponse = components['schemas']['UserResponse'];
type CreateUserRequest = components['schemas']['CreateUserRequest'];

type UserFormValues = CreateUserRequest & {
  submit?: string; // For general form errors
};

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
};

const ROLES = ['ADMIN', 'MANAGER', 'WAITER', 'COOK', 'DRIVER'] as const;

// Validation schemas
const createUserSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  firstName: Yup.string().max(50, 'First name must be at most 50 characters'),
  lastName: Yup.string().max(50, 'Last name must be at most 50 characters'),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-() ]*$/, 'Phone number is invalid')
    .max(20, 'Phone number must be at most 20 characters'),
  role: Yup.string()
    .oneOf(ROLES as unknown as string[])
    .required('Role is required'),
  submit: Yup.string(), // For general form errors
});

const updateUserSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: Yup.string(), // Optional for updates
  firstName: Yup.string().max(50, 'First name must be at most 50 characters'),
  lastName: Yup.string().max(50, 'Last name must be at most 50 characters'),
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-() ]*$/, 'Phone number is invalid')
    .max(20, 'Phone number must be at most 20 characters'),
  role: Yup.string()
    .oneOf(ROLES as unknown as string[])
    .required('Role is required'),
  submit: Yup.string(), // For general form errors
});

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
      onOpenChange(false);
      formik.resetForm();
    },
    onError: (error) => {
      formik.setFieldError('submit', error.message);
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
      onOpenChange(false);
      formik.resetForm();
    },
    onError: (error) => {
      formik.setFieldError('submit', error.message);
    },
  });

  // Formik setup
  const formik = useFormik<UserFormValues>({
    initialValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'WAITER',
    },
    validationSchema: isEdit ? updateUserSchema : createUserSchema,
    onSubmit: (values) => {
      const { submit, ...userData } = values;
      if (isEdit) {
        updateMutation.mutate(userData);
      } else {
        createMutation.mutate(userData);
      }
    },
  });

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (open && user) {
      formik.setValues({
        username: user.username || '',
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || 'WAITER',
      });
    } else if (open && !user) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Update user information and role.' : 'Add a new user to the system.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isEdit || isLoading}
                placeholder="Enter username"
                className={
                  formik.touched.username && formik.errors.username ? 'border-destructive' : ''
                }
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-sm text-destructive">{formik.errors.username}</p>
              )}
            </div>

            {!isEdit && (
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  placeholder="Enter password"
                  className={
                    formik.touched.password && formik.errors.password ? 'border-destructive' : ''
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-destructive">{formik.errors.password}</p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                placeholder="Enter first name"
                className={
                  formik.touched.firstName && formik.errors.firstName ? 'border-destructive' : ''
                }
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-sm text-destructive">{formik.errors.firstName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                placeholder="Enter last name"
                className={
                  formik.touched.lastName && formik.errors.lastName ? 'border-destructive' : ''
                }
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-sm text-destructive">{formik.errors.lastName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoading}
                placeholder="Enter phone number"
                className={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? 'border-destructive'
                    : ''
                }
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-sm text-destructive">{formik.errors.phoneNumber}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formik.values.role}
                onValueChange={(value) => formik.setFieldValue('role', value)}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="role"
                  className={formik.touched.role && formik.errors.role ? 'border-destructive' : ''}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.role && formik.errors.role && (
                <p className="text-sm text-destructive">{formik.errors.role}</p>
              )}
            </div>

            {formik.errors.submit && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {formik.errors.submit}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

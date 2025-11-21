import { useEffect } from 'react';
import { useFormik } from 'formik';
import type { components } from '@repo/api-client';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { ROLES, createUserSchema, updateUserSchema } from './UserForm.validation';
import { useAuthStore } from '../../stores/auth';
import { FormikInput, FormikPasswordInput } from '../inputs';

type UserResponse = components['schemas']['UserResponse'];
type CreateUserRequest = components['schemas']['CreateUserRequest'];

export type UserFormValues = CreateUserRequest & {
  submit?: string; // For general form errors
};

type UserFormProps = {
  user: UserResponse | null;
  isLoading: boolean;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  open: boolean;
};

export function UserForm({ user, isLoading, onSubmit, onCancel, open }: UserFormProps) {
  const isEdit = !!user;
  const currentUser = useAuthStore((state) => state.user);
  const isSelf = currentUser?.id === user?.id;
  const isAdminUser = user?.role === 'ADMIN';
  const cannotChangeRole = isEdit && (isSelf || isAdminUser);

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
    onSubmit,
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 py-4">
        <FormikInput
          formik={formik}
          name="username"
          label="Username"
          required
          disabled={isEdit || isLoading}
          placeholder="Enter username"
        />

        {!isEdit && (
          <FormikPasswordInput
            formik={formik}
            name="password"
            label="Password"
            required
            disabled={isLoading}
            placeholder="Enter password"
          />
        )}

        <FormikInput
          formik={formik}
          name="firstName"
          label="First Name"
          disabled={isLoading}
          placeholder="Enter first name"
        />

        <FormikInput
          formik={formik}
          name="lastName"
          label="Last Name"
          disabled={isLoading}
          placeholder="Enter last name"
        />

        <FormikInput
          formik={formik}
          name="phoneNumber"
          label="Phone Number"
          required
          disabled={isLoading}
          placeholder="Enter phone number"
        />
        <div className="grid gap-2">
          <Label htmlFor="role">
            Role <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formik.values.role}
            onValueChange={(value) => formik.setFieldValue('role', value)}
            disabled={isLoading || cannotChangeRole}
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
          {cannotChangeRole && (
            <p className="text-sm text-muted-foreground">
              {isSelf ? 'You cannot change your own role' : 'Admin role cannot be changed'}
            </p>
          )}
        </div>
        {formik.errors.submit && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {formik.errors.submit}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

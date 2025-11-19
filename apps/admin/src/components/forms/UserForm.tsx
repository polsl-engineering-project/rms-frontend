import { useEffect } from 'react';
import { useFormik } from 'formik';
import type { components } from '@repo/api-client';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { ROLES, createUserSchema, updateUserSchema } from './UserForm.validation';
import { useAuthStore } from '../../stores/auth';

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
          <Label htmlFor="phoneNumber">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            placeholder="Enter phone number"
            className={
              formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-destructive' : ''
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
              {isSelf
                ? 'You cannot change your own role'
                : 'Admin role cannot be changed'}
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

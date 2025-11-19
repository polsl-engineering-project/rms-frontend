import * as Yup from 'yup';

export const ROLES = ['ADMIN', 'MANAGER', 'WAITER', 'COOK', 'DRIVER'] as const;

export const createUserSchema = Yup.object({
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
    .required('Phone number is required')
    .matches(/^[0-9+\-() ]*$/, 'Phone number is invalid')
    .max(20, 'Phone number must be at most 20 characters'),
  role: Yup.string()
    .oneOf(ROLES as unknown as string[])
    .required('Role is required'),
  submit: Yup.string(), // For general form errors
});

export const updateUserSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),
  password: Yup.string(), // Optional for updates
  firstName: Yup.string().max(50, 'First name must be at most 50 characters'),
  lastName: Yup.string().max(50, 'Last name must be at most 50 characters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\-() ]*$/, 'Phone number is invalid')
    .max(20, 'Phone number must be at most 20 characters'),
  role: Yup.string()
    .oneOf(ROLES as unknown as string[])
    .required('Role is required'),
  submit: Yup.string(), // For general form errors
});

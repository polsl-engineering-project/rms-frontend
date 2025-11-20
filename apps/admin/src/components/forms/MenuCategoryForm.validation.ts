import * as Yup from 'yup';

export const createCategorySchema = Yup.object({
  name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  description: Yup.string().max(500, 'Description must be at most 500 characters'),
  active: Yup.boolean().required('Active status is required'),
  submit: Yup.string(), // For general form errors
});

export const updateCategorySchema = Yup.object({
  name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  description: Yup.string().max(500, 'Description must be at most 500 characters'),
  active: Yup.boolean().required('Active status is required'),
  submit: Yup.string(), // For general form errors
});

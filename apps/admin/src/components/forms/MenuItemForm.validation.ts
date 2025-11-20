import * as Yup from 'yup';
import { SPICE_LEVELS } from '../../constants';

export const createMenuItemSchema = Yup.object({
  name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  description: Yup.string().max(500, 'Description must be at most 500 characters'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive')
    .test('decimal', 'Price must have at most 2 decimal places', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  calories: Yup.number()
    .integer('Calories must be a whole number')
    .min(0, 'Calories must be positive')
    .nullable(),
  allergens: Yup.string().max(200, 'Allergens must be at most 200 characters'),
  vegetarian: Yup.boolean().required('Vegetarian status is required'),
  vegan: Yup.boolean().required('Vegan status is required'),
  glutenFree: Yup.boolean().required('Gluten-free status is required'),
  spiceLevel: Yup.string().oneOf(Object.values(SPICE_LEVELS)).required('Spice level is required'),
  categoryId: Yup.string().required('Category is required'),
  submit: Yup.string(), // For general form errors
});

export const updateMenuItemSchema = Yup.object({
  name: Yup.string().required('Name is required').max(100, 'Name must be at most 100 characters'),
  description: Yup.string().max(500, 'Description must be at most 500 characters'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be positive')
    .test('decimal', 'Price must have at most 2 decimal places', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  calories: Yup.number()
    .integer('Calories must be a whole number')
    .min(0, 'Calories must be positive')
    .nullable(),
  allergens: Yup.string().max(200, 'Allergens must be at most 200 characters'),
  vegetarian: Yup.boolean().required('Vegetarian status is required'),
  vegan: Yup.boolean().required('Vegan status is required'),
  glutenFree: Yup.boolean().required('Gluten-free status is required'),
  spiceLevel: Yup.string().oneOf(Object.values(SPICE_LEVELS)).required('Spice level is required'),
  categoryId: Yup.string().uuid('Invalid category').required('Category is required'),
  submit: Yup.string(), // For general form errors
});

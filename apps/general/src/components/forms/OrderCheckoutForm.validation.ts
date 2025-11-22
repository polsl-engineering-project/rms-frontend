import * as Yup from 'yup';
import { ORDER_TYPES } from '../../constants/order';
import type { OrderType } from '../../constants/order';

export const createOrderCheckoutSchema = (orderType: OrderType) =>
  Yup.object().shape({
    // Customer Info - always required
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phoneNumber: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9\s\-+()]+$/, 'Phone number is not valid'),
    // Address fields - only required for delivery
    street: Yup.string().when([], {
      is: () => orderType === ORDER_TYPES.DELIVERY,
      then: (schema) => schema.required('Street is required'),
      otherwise: (schema) => schema.optional(),
    }),
    houseNumber: Yup.string().when([], {
      is: () => orderType === ORDER_TYPES.DELIVERY,
      then: (schema) => schema.required('House number is required'),
      otherwise: (schema) => schema.optional(),
    }),
    apartmentNumber: Yup.string().optional(),
    city: Yup.string().when([], {
      is: () => orderType === ORDER_TYPES.DELIVERY,
      then: (schema) => schema.required('City is required'),
      otherwise: (schema) => schema.optional(),
    }),
    postalCode: Yup.string().when([], {
      is: () => orderType === ORDER_TYPES.DELIVERY,
      then: (schema) => schema.required('Postal code is required'),
      otherwise: (schema) => schema.optional(),
    }),
    apartment: Yup.boolean(),
    // For general form errors
    submit: Yup.string().optional(),
  });

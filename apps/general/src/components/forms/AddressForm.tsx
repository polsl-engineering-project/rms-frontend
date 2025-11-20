import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forwardRef, useImperativeHandle } from 'react';
import { Input, Label, Checkbox } from '@repo/ui';

export interface AddressFormValues {
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  apartment: boolean;
}

interface AddressFormProps {
  onSubmit: (values: AddressFormValues) => void;
  initialValues?: Partial<AddressFormValues>;
}

export interface AddressFormHandle {
  submitForm: () => Promise<void>;
}

const validationSchema = Yup.object({
  street: Yup.string().required('Street is required'),
  houseNumber: Yup.string().required('House number is required'),
  apartmentNumber: Yup.string(),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal code is required'),
  apartment: Yup.boolean(),
});

export const AddressForm = forwardRef<AddressFormHandle, AddressFormProps>(
  ({ onSubmit, initialValues }, ref) => {
    const formik = useFormik({
      initialValues: {
        street: initialValues?.street || '',
        houseNumber: initialValues?.houseNumber || '',
        apartmentNumber: initialValues?.apartmentNumber || '',
        city: initialValues?.city || '',
        postalCode: initialValues?.postalCode || '',
        apartment: initialValues?.apartment || false,
      },
      validationSchema,
      onSubmit,
    });

    useImperativeHandle(ref, () => ({
      submitForm: formik.submitForm,
    }));

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="street">Street *</Label>
            <Input
              id="street"
              name="street"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.street}
              className={formik.touched.street && formik.errors.street ? 'border-red-500' : ''}
            />
            {formik.touched.street && formik.errors.street && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.street}</p>
            )}
          </div>

          <div>
            <Label htmlFor="houseNumber">House Number *</Label>
            <Input
              id="houseNumber"
              name="houseNumber"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.houseNumber}
              className={
                formik.touched.houseNumber && formik.errors.houseNumber ? 'border-red-500' : ''
              }
            />
            {formik.touched.houseNumber && formik.errors.houseNumber && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.houseNumber}</p>
            )}
          </div>

          <div>
            <Label htmlFor="apartmentNumber">Apartment Number</Label>
            <Input
              id="apartmentNumber"
              name="apartmentNumber"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.apartmentNumber}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
              className={formik.touched.city && formik.errors.city ? 'border-red-500' : ''}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.city}</p>
            )}
          </div>

          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              name="postalCode"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.postalCode}
              className={
                formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : ''
              }
            />
            {formik.touched.postalCode && formik.errors.postalCode && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.postalCode}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="apartment"
            name="apartment"
            checked={formik.values.apartment}
            onCheckedChange={(checked) => formik.setFieldValue('apartment', checked)}
          />
          <Label htmlFor="apartment" className="cursor-pointer">
            This is an apartment
          </Label>
        </div>
      </form>
    );
  }
);

AddressForm.displayName = 'AddressForm';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forwardRef, useImperativeHandle } from 'react';
import { Input, Label } from '@repo/ui';

export interface CustomerInfoFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface CustomerInfoFormProps {
  onSubmit: (values: CustomerInfoFormValues) => void;
  initialValues?: Partial<CustomerInfoFormValues>;
}

export interface CustomerInfoFormHandle {
  submitForm: () => Promise<void>;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9\s\-+()]+$/, 'Phone number is not valid'),
});

export const CustomerInfoForm = forwardRef<CustomerInfoFormHandle, CustomerInfoFormProps>(
  ({ onSubmit, initialValues }, ref) => {
    const formik = useFormik({
      initialValues: {
        firstName: initialValues?.firstName || '',
        lastName: initialValues?.lastName || '',
        phoneNumber: initialValues?.phoneNumber || '',
      },
      validationSchema,
      onSubmit,
    });

    useImperativeHandle(ref, () => ({
      submitForm: formik.submitForm,
    }));

    return (
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            className={formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.firstName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            className={formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.lastName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className={
              formik.touched.phoneNumber && formik.errors.phoneNumber ? 'border-red-500' : ''
            }
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <p className="text-sm text-red-600 mt-1">{formik.errors.phoneNumber}</p>
          )}
        </div>
      </form>
    );
  }
);

CustomerInfoForm.displayName = 'CustomerInfoForm';

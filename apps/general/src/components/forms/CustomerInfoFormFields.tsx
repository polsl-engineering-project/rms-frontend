import { FormikProps } from 'formik';
import { Input, Label } from '@repo/ui';

export interface CheckoutFormValues {
  // Customer Info
  firstName: string;
  lastName: string;
  phoneNumber: string;
  // Address (only used for delivery)
  street: string;
  houseNumber: string;
  apartmentNumber: string;
  city: string;
  postalCode: string;
  apartment: boolean;
}

interface CustomerInfoFormFieldsProps {
  formik: FormikProps<CheckoutFormValues>;
}

export function CustomerInfoFormFields({ formik }: CustomerInfoFormFieldsProps) {
  return (
    <div className="space-y-4">
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
          <p className="text-sm text-red-600 mt-1">{String(formik.errors.firstName)}</p>
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
          <p className="text-sm text-red-600 mt-1">{String(formik.errors.lastName)}</p>
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
          <p className="text-sm text-red-600 mt-1">{String(formik.errors.phoneNumber)}</p>
        )}
      </div>
    </div>
  );
}

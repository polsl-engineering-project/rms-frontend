import { FormikProps } from 'formik';
import { Input, Label, Checkbox } from '@repo/ui';
import { CheckoutFormValues } from './CustomerInfoFormFields';

interface AddressFormFieldsProps {
  formik: FormikProps<CheckoutFormValues>;
}

export function AddressFormFields({ formik }: AddressFormFieldsProps) {
  return (
    <div className="space-y-4">
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
            <p className="text-sm text-red-600 mt-1">{String(formik.errors.street)}</p>
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
            <p className="text-sm text-red-600 mt-1">{String(formik.errors.houseNumber)}</p>
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
            <p className="text-sm text-red-600 mt-1">{String(formik.errors.city)}</p>
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
            <p className="text-sm text-red-600 mt-1">{String(formik.errors.postalCode)}</p>
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
    </div>
  );
}

import { useEffect } from 'react';
import { useFormik } from 'formik';
import type { components } from '@repo/api-client';
import { Button, Label, Checkbox } from '@repo/ui';
import { createCategorySchema, updateCategorySchema } from './MenuCategoryForm.validation';
import { FormikInput } from '../inputs';

type MenuCategoryResponse = components['schemas']['MenuCategoryResponse'];
type CreateMenuCategoryRequest = components['schemas']['CreateMenuCategoryRequest'];

export type MenuCategoryFormValues = CreateMenuCategoryRequest & {
  submit?: string;
};

type MenuCategoryFormProps = {
  category: MenuCategoryResponse | null;
  isLoading: boolean;
  onSubmit: (values: MenuCategoryFormValues) => void;
  onCancel: () => void;
  open: boolean;
};

export function MenuCategoryForm({
  category,
  isLoading,
  onSubmit,
  onCancel,
  open,
}: MenuCategoryFormProps) {
  const isEdit = !!category;

  const formik = useFormik<MenuCategoryFormValues>({
    initialValues: {
      name: '',
      description: '',
      active: true,
    },
    validationSchema: isEdit ? updateCategorySchema : createCategorySchema,
    onSubmit,
  });

  useEffect(() => {
    if (open && category) {
      formik.setValues({
        name: category.name || '',
        description: category.description || '',
        active: category.active ?? true,
      });
    } else if (open && !category) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 py-4">
        <FormikInput
          formik={formik}
          name="name"
          label="Name"
          required
          disabled={isLoading}
          placeholder="Enter category name"
        />

        <FormikInput
          formik={formik}
          name="description"
          label="Description"
          disabled={isLoading}
          placeholder="Enter description (optional)"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={formik.values.active}
            onCheckedChange={(checked) => formik.setFieldValue('active', checked)}
            disabled={isLoading}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
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
          {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}

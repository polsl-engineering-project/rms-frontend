import { useEffect } from 'react';
import { useFormik } from 'formik';
import { useQuery } from '@tanstack/react-query';
import type { components } from '@repo/api-client';
import {
  Button,
  Label,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { createMenuItemSchema, updateMenuItemSchema } from './MenuItemForm.validation';
import { SPICE_LEVELS } from '../../constants';
import { fetchClient } from '../../api/client';
import { FormikInput } from '../inputs';

type MenuItemResponse = components['schemas']['MenuItemResponse'];
type CreateMenuItemRequest = components['schemas']['CreateMenuItemRequest'];

export type MenuItemFormValues = CreateMenuItemRequest & {
  submit?: string;
};

type MenuItemFormProps = {
  item: MenuItemResponse | null;
  isLoading: boolean;
  onSubmit: (values: MenuItemFormValues) => void;
  onCancel: () => void;
  open: boolean;
};

export function MenuItemForm({ item, isLoading, onSubmit, onCancel, open }: MenuItemFormProps) {
  const isEdit = !!item;

  // Fetch categories for the dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['menu-categories-all'],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET('/api/v1/menu/category', {
        params: {
          query: {
            page: 0,
            size: 100, // Get all categories
          },
        },
      });

      if (error) {
        throw new Error('Failed to fetch categories');
      }

      return data;
    },
    enabled: open, // Only fetch when dialog is open
  });

  const formik = useFormik<MenuItemFormValues>({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      calories: undefined,
      allergens: '',
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spiceLevel: 'NONE',
      categoryId: '',
    },
    validationSchema: isEdit ? updateMenuItemSchema : createMenuItemSchema,
    onSubmit,
  });

  useEffect(() => {
    if (open && item) {
      formik.setValues({
        name: item.name || '',
        description: item.description || '',
        price: item.price || 0,
        calories: item.calories,
        allergens: item.allergens || '',
        vegetarian: item.vegetarian ?? false,
        vegan: item.vegan ?? false,
        glutenFree: item.glutenFree ?? false,
        spiceLevel: item.spiceLevel || 'NONE',
        categoryId: item.categoryId || '',
      });
    } else if (open && !item) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, item]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
          <FormikInput
            formik={formik}
            name="name"
            label="Name"
            required
            disabled={isLoading}
            placeholder="Enter item name"
          />
        </div>
        <div className="grid gap-2">
          <FormikInput
            formik={formik}
            name="description"
            label="Description"
            disabled={isLoading}
            placeholder="Enter description (optional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <FormikInput
              formik={formik}
              name="price"
              label="Price"
              required
              type="number"
              step="0.01"
              min="0"
              disabled={isLoading}
              placeholder="0.00"
            />
          </div>

          <div className="grid gap-2">
            <FormikInput
              formik={formik}
              name="calories"
              label="Calories"
              type="number"
              min="0"
              disabled={isLoading}
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="categoryId">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formik.values.categoryId}
            onValueChange={(value) => formik.setFieldValue('categoryId', value)}
            disabled={isLoading || categoriesLoading}
          >
            <SelectTrigger
              id="categoryId"
              className={
                formik.touched.categoryId && formik.errors.categoryId ? 'border-destructive' : ''
              }
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesData?.content?.map((category) => (
                <SelectItem key={category.id} value={category.id!}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="text-sm text-destructive">{formik.errors.categoryId}</p>
          )}
        </div>
        <div className="grid gap-2">
          <FormikInput
            formik={formik}
            name="allergens"
            label="Allergens"
            disabled={isLoading}
            placeholder="e.g., nuts, dairy, gluten"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="spiceLevel">
            Spice Level <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formik.values.spiceLevel}
            onValueChange={(value) => formik.setFieldValue('spiceLevel', value)}
            disabled={isLoading}
          >
            <SelectTrigger
              id="spiceLevel"
              className={
                formik.touched.spiceLevel && formik.errors.spiceLevel ? 'border-destructive' : ''
              }
            >
              <SelectValue placeholder="Select spice level" />
            </SelectTrigger>
            <SelectContent>
              {(Object.values(SPICE_LEVELS) as string[]).map((level) => (
                <SelectItem key={level} value={level}>
                  {level.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.spiceLevel && formik.errors.spiceLevel && (
            <p className="text-sm text-destructive">{formik.errors.spiceLevel}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label>Dietary Information</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vegetarian"
                checked={formik.values.vegetarian}
                onCheckedChange={(checked) => formik.setFieldValue('vegetarian', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="vegetarian" className="cursor-pointer font-normal">
                Vegetarian
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vegan"
                checked={formik.values.vegan}
                onCheckedChange={(checked) => formik.setFieldValue('vegan', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="vegan" className="cursor-pointer font-normal">
                Vegan
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="glutenFree"
                checked={formik.values.glutenFree}
                onCheckedChange={(checked) => formik.setFieldValue('glutenFree', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="glutenFree" className="cursor-pointer font-normal">
                Gluten Free
              </Label>
            </div>
          </div>
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
          {isLoading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}

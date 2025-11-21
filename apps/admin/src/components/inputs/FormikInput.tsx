import type { FormikContextType } from 'formik';
import { InputBase, type InputBaseProps } from './InputBase';

export interface FormikInputProps<Values>
  extends Omit<
    InputBaseProps,
    'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'errorMessage'
  > {
  formik: FormikContextType<Values>;
  name: keyof Values & string;
}

export const FormikInput = <Values,>({ formik, name, ...props }: FormikInputProps<Values>) => {
  const value = formik.values[name];
  const touched = formik.touched[name];
  const error = formik.errors[name];

  return (
    <InputBase
      name={name}
      value={value as string | number | readonly string[] | undefined}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={!!(touched && error)}
      errorMessage={error as string | undefined}
      {...props}
    />
  );
};

FormikInput.displayName = 'FormikInput';

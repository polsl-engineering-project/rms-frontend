import type { FormikContextType } from 'formik';
import { PasswordInput, type PasswordInputProps } from './PasswordInput';

export interface FormikPasswordInputProps<Values>
  extends Omit<
    PasswordInputProps,
    'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'errorMessage'
  > {
  formik: FormikContextType<Values>;
  name: keyof Values & string;
}

export const FormikPasswordInput = <Values,>({
  formik,
  name,
  ...props
}: FormikPasswordInputProps<Values>) => {
  const value = formik.values[name];
  const touched = formik.touched[name];
  const error = formik.errors[name];

  return (
    <PasswordInput
      name={name}
      value={value as string}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      error={!!(touched && error)}
      errorMessage={error as string | undefined}
      {...props}
    />
  );
};

FormikPasswordInput.displayName = 'FormikPasswordInput';

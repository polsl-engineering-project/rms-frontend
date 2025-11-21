import * as React from 'react';
import { Input } from '@repo/ui';
import { cn } from '@repo/ui';

export interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
  containerClassName?: string;
}

export const InputBase = React.forwardRef<HTMLInputElement, InputBaseProps>(
  (
    {
      error,
      errorMessage,
      label,
      required,
      showRequiredIndicator = true,
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || 'input';

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {required && showRequiredIndicator && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && 'border-destructive', className)}
          {...props}
        />
        {error && errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
      </div>
    );
  }
);

InputBase.displayName = 'InputBase';

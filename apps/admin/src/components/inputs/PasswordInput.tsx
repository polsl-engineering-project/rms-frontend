import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from '@repo/ui';
import { cn } from '@repo/ui';
import { InputBase, type InputBaseProps } from './InputBase';

export interface PasswordInputProps extends Omit<InputBaseProps, 'type'> {
  showToggle?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    if (!showToggle) {
      return <InputBase ref={ref} type="password" className={className} {...props} />;
    }

    return (
      <div className="relative">
        <InputBase
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 mt-3.5 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

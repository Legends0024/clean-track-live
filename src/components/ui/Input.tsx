import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    const inputClasses = cn(
      'flex h-11 w-full rounded-xl border bg-background px-3 py-2 text-sm transition-colors',
      'border-input hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
      'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={inputClasses}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
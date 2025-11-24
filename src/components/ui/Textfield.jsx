'use client';

import React from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const TextField = React.forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      size = 'md',
      // variant = 'default',
      color = 'default',
      errorColor = 'destructive',
      type = 'text',
      id,
      multiline = false,
      rows = 3,
      endAdornment,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId();
    const hasError = !!error;

    const sizeClasses = {
      sm: `${!multiline ? 'h-8' : ''} px-2.5 py-1 text-sm`,
      md: `${!multiline ? 'h-9' : ''} px-3 py-1 text-base md:text-sm`,
      lg: `${!multiline ? 'h-11' : ''} px-4 py-2 text-base`
    };

    const adornmentPadding = {
      sm: 'pt-1',
      md: 'pt-1',
      lg: 'pt-2'
    };

    const colorClasses = {
      default: 'focus-visible:border-primary focus-visible:ring-primary',
      primary: 'focus-visible:border-blue-500 focus-visible:ring-blue-500',
      secondary: 'focus-visible:border-purple-500 focus-visible:ring-purple-500',
      success: 'focus-visible:border-green-500 focus-visible:ring-green-500',
      warning: 'focus-visible:border-yellow-500 focus-visible:ring-yellow-500'
    };

    const errorColorClasses = {
      destructive: 'aria-invalid:border-red-700 aria-invalid:ring-red-700/20',
      red: 'aria-invalid:border-red-500 aria-invalid:ring-red-500/20',
      orange: 'aria-invalid:border-orange-500 aria-invalid:ring-orange-500/20'
    };

    const getErrorTextColor = (errColor) => {
      switch (errColor) {
        case 'destructive':
          return 'text-red-700';
        case 'red':
          return 'text-red-500';
        case 'orange':
          return 'text-orange-500';
        default:
          return 'text-red-700';
      }
    };

    const labelColorClasses = {
      default: hasError ? getErrorTextColor(errorColor) : 'text-gray-500',
      primary: hasError ? getErrorTextColor(errorColor) : 'text-blue-500',
      secondary: hasError ? getErrorTextColor(errorColor) : 'text-purple-500',
      success: hasError ? getErrorTextColor(errorColor) : 'text-green-500',
      warning: hasError ? getErrorTextColor(errorColor) : 'text-yellow-500'
    };

    const commonInputProps = {
      ref: ref,
      id: inputId,
      'aria-invalid': hasError,
      'aria-describedby': error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined,
      className: cn(
        'w-full min-w-0 rounded-md border bg-transparent shadow-sm transition-[color,box-shadow] outline-none',
        'placeholder:text-gray-400',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

        'border-gray-300',

        multiline ? 'resize-y' : '',
        endAdornment ? 'pr-10' : '',
        sizeClasses[size],

        'focus-visible:ring-[2px]',
        hasError ? errorColorClasses[errorColor] : colorClasses[color],

        className
      ),
      ...props
    };

    return (
      <div className="grid gap-2 ">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              labelColorClasses[color]
            )}>
            {label}
          </label>
        )}

        <div className="relative">
          {multiline ? (
            <textarea {...commonInputProps} rows={rows} />
          ) : (
            <input {...commonInputProps} type={type} />
          )}

          {endAdornment && (
            <div
              className={cn(
                'absolute right-0 flex pr-3',
                multiline ? `top-0 items-start ${adornmentPadding[size]}` : 'inset-y-0 items-center'
              )}>
              {endAdornment}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p
            id={error ? `${inputId}-error` : `${inputId}-helper`}
            className={cn('text-sm', error ? getErrorTextColor(errorColor) : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

export { TextField };

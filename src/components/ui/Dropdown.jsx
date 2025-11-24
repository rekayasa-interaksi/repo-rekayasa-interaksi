'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Dropdown = React.forwardRef(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = 'Select an option...',
      searchPlaceholder = 'Search options...',
      emptyMessage = 'No options found.',
      disabled = false,
      className,
      size = 'md',
      color = 'default',
      error,
      errorColor = 'destructive',
      label,
      helperText,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const popoverRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (selectedValue) => {
      onValueChange?.(selectedValue === value ? '' : selectedValue);
      setOpen(false);
      setSearchValue('');
    };

    const filteredOptions = options.filter((option) =>
      option?.label?.toLowerCase().includes(searchValue.toLowerCase())
    );

    const isError = !!error;

    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-9 px-3 text-sm',
      lg: 'h-11 px-4 text-base'
    };

    const colorClasses = {
      default: 'focus:ring-primary data-[state=open]:ring-primary',
      primary: 'focus:ring-blue-500 data-[state=open]:ring-blue-500',
      secondary: 'focus:ring-purple-500 data-[state=open]:ring-purple-500',
      success: 'focus:ring-green-500 data-[state=open]:ring-green-500',
      warning: 'focus:ring-yellow-500 data-[state=open]:ring-yellow-500'
    };

    const labelColorClasses = {
      default: 'text-gray-500 ',
      primary: 'text-blue-600 ',
      secondary: 'text-purple-600 ',
      success: 'text-green-600 ',
      warning: 'text-yellow-600 '
    };

    const getErrorClasses = (errColor) => {
      switch (errColor) {
        case 'red':
          return { border: 'border-red-500', text: 'text-red-600 ', ring: 'ring-red-500/20' };
        case 'orange':
          return {
            border: 'border-orange-500',
            text: 'text-orange-600 ',
            ring: 'ring-orange-500/20'
          };
        default:
          return { border: 'border-red-700', text: 'text-red-700 ', ring: 'ring-red-700/20' };
      }
    };

    const errorClasses = getErrorClasses(errorColor);

    return (
      <div className="grid gap-2" ref={popoverRef}>
        {label && (
          <label
            className={cn(
              'text-sm font-medium',
              isError ? errorClasses.text : labelColorClasses[color]
            )}>
            {label}
          </label>
        )}

        <div className="relative">
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-controls=""
            aria-expanded={open}
            disabled={disabled}
            onClick={() => setOpen(!open)}
            data-state={open ? 'open' : 'closed'}
            className={cn(
              'w-full flex items-center justify-between rounded-md border border-gray-300  bg-transparent text-left shadow-sm transition-colors',
              'focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              sizeClasses[size],
              variant === 'filled' && 'bg-gray-100/50  hover:bg-gray-100/70 ',
              !isError && colorClasses[color],
              isError && `${errorClasses.border} ${errorClasses.text} ${errorClasses.ring}`,
              !selectedOption && 'text-gray-400  font-normal',
              className
            )}
            {...props}>
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-3 w-3 shrink-0 opacity-50" />
          </button>

          {open && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200  bg-white  shadow-lg">
              <div className="flex items-center border-b border-gray-200  px-3">
                <FontAwesomeIcon icon={faSearch} className="mr-2 h-3 w-3 shrink-0 opacity-50" />
                <input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-300  disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <ul className="max-h-60 overflow-auto p-1">
                {filteredOptions.length === 0 ? (
                  <li className="px-2 py-1.5 text-sm text-center text-gray-400 ">{emptyMessage}</li>
                ) : (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                        'hover:bg-gray-100 ',
                        option.disabled && 'cursor-not-allowed opacity-50'
                      )}>
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={cn(
                            'h-3 w-3',
                            value === option.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </span>
                      {option.label}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {(error || helperText) && (
          <p className={cn('text-xs', isError ? errorClasses.text : 'text-gray-500 ')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export { Dropdown };

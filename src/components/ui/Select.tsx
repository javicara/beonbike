import React from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    options,
    value,
    onChange,
    error,
    helpText,
    fullWidth = false,
    className,
    id,
    ...props
  }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={clsx('flex flex-col', fullWidth && 'w-full')}>
        <label
          htmlFor={selectId}
          className="mb-1 text-sm font-medium text-neutral"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            'rounded-md border border-neutral-light px-3 py-2 pr-8',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'bg-white appearance-none',
            error && 'border-red-500 focus:ring-red-500',
            fullWidth && 'w-full',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helpText
              ? `${selectId}-help`
              : undefined
          }
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {helpText && !error && (
          <p
            id={`${selectId}-help`}
            className="mt-1 text-sm text-neutral-light"
          >
            {helpText}
          </p>
        )}
      </div>
    );
  }
); 
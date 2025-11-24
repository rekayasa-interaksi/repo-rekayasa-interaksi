import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const sizeMap = {
  sm: { control: 14, dot: 7, gap: 8 },
  md: { control: 18, dot: 9, gap: 10 },
  lg: { control: 22, dot: 11, gap: 12 }
};

const RadioButton = forwardRef(function RadioButton(
  {
    id,
    name,
    value,
    checked,
    defaultChecked,
    onChange,
    label,
    description,
    disabled = false,
    required = false,
    className = '',
    size = 'md',
    ...rest
  },
  ref
) {
  const inputId = id || `${name}-${String(value)}`;
  const s = sizeMap[size] || sizeMap.md;

  const controlStyle = {
    width: s.control,
    height: s.control,
    minWidth: s.control,
    borderRadius: '50%',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #9ca3af',
    background: disabled ? '#f3f4f6' : 'white',
    transition: 'border-color .12s ease, background .12s ease',
    marginRight: s.gap,
    flexShrink: 0
  };

  const dotStyle = {
    width: s.dot,
    height: s.dot,
    borderRadius: '50%',
    background: disabled ? '#9ca3af' : '#2563eb',
    transform: 'scale(0)',
    transition: 'transform .12s ease'
  };

  const wrapperStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    gap: 6
  };

  const labelStyle = {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
    color: disabled ? '#9ca3af' : 'inherit'
  };

  const dotTransform =
    typeof checked === 'boolean'
      ? checked
        ? { transform: 'scale(1)' }
        : { transform: 'scale(0)' }
      : defaultChecked
      ? { transform: 'scale(1)' }
      : {};

  return (
    <label htmlFor={inputId} className={className} style={wrapperStyle}>
      <input
        ref={ref}
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-disabled={disabled}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          pointerEvents: 'none'
        }}
        {...rest}
      />
      <span
        aria-hidden="true"
        style={{
          ...controlStyle,
          borderColor: disabled ? '#d1d5db' : '#9ca3af'
        }}>
        <span style={{ ...dotStyle, ...dotTransform }} />
      </span>

      <span style={labelStyle}>
        <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
        {description && (
          <span style={{ fontSize: 12, color: disabled ? '#9ca3af' : '#6b7280' }}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
});

RadioButton.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

const RadioGroup = ({
  title,
  name,
  options,
  value,
  onChange,
  disabled = false,
  className = '',
  size = 'md'
}) => {
  return (
    <div
      className={className}
      role="radiogroup"
      aria-labelledby={title ? `${name}-title` : undefined}>
      {title && (
        <label
          id={`${name}-title`}
          style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: disabled ? '#9ca3af' : '#374151'
          }}>
          {title}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            id={`${name}-${option.value}`}
            name={name}
            label={option.label}
            value={option.value}
            description={option.description}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled || option.disabled}
            size={size}
          />
        ))}
      </div>
    </div>
  );
};

RadioGroup.propTypes = {
  title: PropTypes.string,

  name: PropTypes.string.isRequired,

  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      value: PropTypes.any.isRequired,
      description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      disabled: PropTypes.bool
    })
  ).isRequired,

  value: PropTypes.any,

  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export { RadioButton, RadioGroup };

import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Checkbox = forwardRef(function Checkbox(
  {
    id,
    name,
    checked,
    defaultChecked,
    onChange,
    label,
    disabled = false,
    indeterminate = false,
    size = 16,
    color = '#2563eb',
    className = '',
    style = {},
    ...props
  },
  ref
) {
  const internalRef = useRef(null);
  const inputRef = ref || internalRef;

  useEffect(() => {
    const node = inputRef && inputRef.current;
    if (node) {
      node.indeterminate = !!indeterminate;
    }
  }, [indeterminate, inputRef]);

  const boxSize = `${size}px`;
  const checkedFlag = typeof checked === 'boolean' ? checked : undefined;

  return (
    <label
      htmlFor={id}
      className={`rc-checkbox-root ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        ...style
      }}>
      <input
        id={id}
        name={name}
        ref={inputRef}
        type="checkbox"
        checked={checkedFlag}
        defaultChecked={defaultChecked}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
          margin: 0,
          padding: 0
        }}
        {...props}
      />

      <span
        aria-hidden
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          width: boxSize,
          height: boxSize,
          minWidth: boxSize,
          borderRadius: 4,
          border: `2px solid ${disabled ? '#e6e7ea' : '#cbd5e1'}`,
          background: checkedFlag || indeterminate ? (disabled ? '#a8b4d6' : color) : 'transparent',
          transition: 'background .12s, border-color .12s',
          boxSizing: 'border-box',
          color: '#fff'
        }}>
        {indeterminate ? (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="11" width="16" height="2" fill="currentColor" rx="1" />
          </svg>
        ) : checkedFlag ? (
          <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : null}
      </span>

      {label ? (
        <span
          style={{
            color: disabled ? '#9aa0a6' : 'inherit',
            fontSize: 14,
            lineHeight: 1
          }}>
          {label}
        </span>
      ) : null}
    </label>
  );
});

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Checkbox;

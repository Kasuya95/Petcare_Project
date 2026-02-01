import React from 'react';
import { X } from 'lucide-react';

const FormInput = ({
  label = '',
  type = 'text',
  placeholder = '',
  name = '',
  value = '',
  onChange = () => {},
  error = '',
  required = false,
  disabled = false,
  icon: Icon = null,
  className = '',
  helpText = '',
  clearable = false,
  ...props
}) => {
  const handleClear = () => {
    if (onChange && name) {
      onChange({
        target: { name, value: '' }
      });
    }
  };

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text font-semibold flex items-center gap-2">
            {Icon && <Icon size={18} className="text-primary" />}
            {label}
            {required && <span className="text-error">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`input input-bordered focus:input-primary w-full ${
            error ? 'input-error' : ''
          } ${clearable && value ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-error transition-colors"
            title="เคลียร์"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}

      {helpText && (
        <label className="label">
          <span className="label-text-alt text-gray-500">{helpText}</span>
        </label>
      )}
    </div>
  );
};

export default FormInput;

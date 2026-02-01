import React from 'react';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, success, error, warning, info, ghost, outline
  size = 'md', // sm, md, lg
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon = null,
  className = '',
  ...props
}) => {
  const baseStyles = 'btn transition-all duration-200 font-semibold';
  
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    error: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
  };

  const sizeStyles = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const loadingStyle = loading ? 'loading loading-spinner' : '';

  const classes = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
    ${disabledStyle}
    ${loadingStyle}
    ${className}
  `;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Button;

import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // primary, secondary, success, error, warning, info
  size = 'md', // sm, md, lg
  outline = false,
  className = '',
}) => {
  const baseStyles = 'badge transition-all duration-200';
  
  const variantStyles = {
    primary: outline ? 'badge-outline' : 'badge-primary',
    secondary: outline ? 'badge-outline' : 'badge-secondary',
    success: outline ? 'badge-outline' : 'badge-success',
    error: outline ? 'badge-outline' : 'badge-error',
    warning: outline ? 'badge-outline' : 'badge-warning',
    info: outline ? 'badge-outline' : 'badge-info',
  };

  const sizeStyles = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  };

  const classes = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  return <span className={classes}>{children}</span>;
};

export default Badge;

import React from 'react';

const Card = ({
  children,
  className = '',
  shadow = true,
  padding = true,
  border = false,
  hover = false,
}) => {
  const baseStyles = 'card bg-base-100 transition-all duration-200';
  const shadowStyle = shadow ? 'shadow-md' : '';
  const paddingStyle = padding ? 'card-body' : '';
  const borderStyle = border ? 'border border-base-300' : '';
  const hoverStyle = hover ? 'hover:shadow-lg hover:border-primary' : '';

  const classes = `
    ${baseStyles}
    ${shadowStyle}
    ${borderStyle}
    ${hoverStyle}
  `;

  return (
    <div className={`${classes} ${className}`}>
      {padding ? <div className={paddingStyle}>{children}</div> : children}
    </div>
  );
};

export default Card;

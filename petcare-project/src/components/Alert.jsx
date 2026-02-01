import React from 'react';

const Alert = ({
  type = 'info', // info, success, warning, error
  title = '',
  message = '',
  children = null,
  closeable = false,
  onClose = () => {},
}) => {
  const typeStyles = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  const icons = {
    info: '(i)',
    success: '✓',
    warning: '!',
    error: '✕',
  };

  return (
    <div className={`alert ${typeStyles[type]} shadow-lg`}>
      <div className="flex-1">
        {title && <h3 className="font-bold">{title}</h3>}
        {message && <div className="text-sm">{message}</div>}
        {children}
      </div>
      {closeable && (
        <button
          className="btn btn-sm btn-ghost"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;

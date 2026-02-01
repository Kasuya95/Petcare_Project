import React from 'react';

const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = '',
  children,
  size = 'md', // sm, md, lg, xl
  closeButton = true,
}) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${sizeStyles[size]} w-full`}>
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="font-bold text-lg">{title}</h3>}
          {closeButton && (
            <button
              className="btn btn-sm btn-circle btn-ghost ml-auto"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>

        <div className="py-4">{children}</div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            ปิด
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default Modal;

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {title && (
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">
          {children}
        </div>
        {actions && (
          <div className="border-t px-6 py-4 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

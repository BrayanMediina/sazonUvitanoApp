import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Algo salió mal',
  message = 'Intenta nuevamente',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-5xl mb-4">❌</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Reintentar
        </Button>
      )}
    </div>
  );
};

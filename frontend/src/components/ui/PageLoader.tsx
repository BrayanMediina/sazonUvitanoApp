import React from 'react';
import { Spinner } from './Spinner';

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Cargando...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="lg" />
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
};

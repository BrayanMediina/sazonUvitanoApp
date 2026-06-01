import React from 'react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-4">Página no encontrada</p>
      <a href="/" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
        Volver al inicio
      </a>
    </div>
  );
};

import React from 'react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-500 to-orange-600">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">🍲</h1>
          <h1 className="text-3xl font-bold text-white">El Sazón Uvitano</h1>
          <p className="text-orange-100 mt-2">Bienvenido</p>
        </div>
        {/* Aquí irá el componente LoginForm */}
      </div>
    </div>
  );
};

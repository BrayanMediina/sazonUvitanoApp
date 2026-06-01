import React from 'react';

export const UsuarioRow: React.FC = () => {
  return (
    <div className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
      <div>
        <p className="font-semibold">Usuario</p>
        <p className="text-sm text-gray-600">usuario@email.com</p>
      </div>
      <button className="text-blue-600 hover:text-blue-800">Editar</button>
    </div>
  );
};

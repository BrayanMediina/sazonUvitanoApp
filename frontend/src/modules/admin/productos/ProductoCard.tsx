import React from 'react';

export const ProductoCard: React.FC = () => {
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <p className="font-semibold">Producto</p>
      <p className="text-orange-600 font-bold">$0</p>
      <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded">
        Editar
      </button>
    </div>
  );
};

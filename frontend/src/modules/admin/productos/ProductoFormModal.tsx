import React from 'react';

export const ProductoFormModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Nombre del producto"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="number"
        placeholder="Precio"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <select className="w-full px-3 py-2 border rounded-lg">
        <option>Platos</option>
        <option>Bebidas</option>
        <option>Postres</option>
      </select>
    </div>
  );
};

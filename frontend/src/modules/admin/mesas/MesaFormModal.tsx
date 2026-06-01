import React from 'react';

export const MesaFormModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <input
        type="number"
        placeholder="Número de mesa"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <input
        type="number"
        placeholder="Capacidad"
        className="w-full px-3 py-2 border rounded-lg"
      />
      <select className="w-full px-3 py-2 border rounded-lg">
        <option>Disponible</option>
        <option>Ocupada</option>
        <option>Reservada</option>
      </select>
    </div>
  );
};

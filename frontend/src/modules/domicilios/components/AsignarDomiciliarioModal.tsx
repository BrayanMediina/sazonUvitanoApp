import React from 'react';

export const AsignarDomiciliarioModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Asignar Domiciliario</h2>
      <select className="w-full px-3 py-2 border rounded-lg">
        <option>Seleccionar domiciliario...</option>
        <option>Juan Pérez</option>
        <option>María González</option>
      </select>
    </div>
  );
};

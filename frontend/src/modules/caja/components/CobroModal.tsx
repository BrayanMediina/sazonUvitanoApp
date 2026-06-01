import React from 'react';

export const CobroModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Proceso de Cobro</h2>
      <div>
        <label className="block text-sm font-medium mb-2">Método de Pago</label>
        <select className="w-full border rounded-lg p-2">
          <option>Efectivo</option>
          <option>Tarjeta</option>
          <option>Transferencia</option>
        </select>
      </div>
    </div>
  );
};

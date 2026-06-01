import React from 'react';

export const CierreCajaModal: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Cierre de Caja</h2>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total vendido</p>
        <p className="text-3xl font-bold text-blue-600">$0</p>
      </div>
    </div>
  );
};

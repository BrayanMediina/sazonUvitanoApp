import React from 'react';

export const ResumenDiario: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
        <p className="text-sm opacity-90">Pedidos</p>
        <p className="text-3xl font-bold">24</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
        <p className="text-sm opacity-90">Ingresos</p>
        <p className="text-2xl font-bold">$1.2M</p>
      </div>
    </div>
  );
};

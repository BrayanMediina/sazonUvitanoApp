import React from 'react';

export const PedidoCobroCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-600">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">Pedido #001</p>
          <p className="text-sm text-gray-600">Mesa 5</p>
        </div>
        <p className="text-2xl font-bold text-orange-600">$50,000</p>
      </div>
    </div>
  );
};

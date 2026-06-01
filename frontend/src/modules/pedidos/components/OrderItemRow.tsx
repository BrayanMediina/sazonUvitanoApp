import React from 'react';

export const OrderItemRow: React.FC = () => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
      <div>
        <p className="font-semibold">Producto</p>
        <p className="text-sm text-gray-600">x1</p>
      </div>
      <p className="font-semibold">$0</p>
    </div>
  );
};

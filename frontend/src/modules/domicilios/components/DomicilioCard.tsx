import React from 'react';

export const DomicilioCard: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
      <h3 className="font-semibold">Domicilio #001</h3>
      <p className="text-sm text-gray-600">Dirección: Cra 5 #123</p>
      <p className="text-sm text-gray-600">Tel: 3001234567</p>
      <div className="mt-2 flex justify-between">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          En entrega
        </span>
        <span className="text-orange-600 font-bold">$50,000</span>
      </div>
    </div>
  );
};

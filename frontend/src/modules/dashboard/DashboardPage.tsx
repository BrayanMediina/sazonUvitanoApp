import React from 'react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Pedidos Hoy</h2>
          <p className="text-3xl font-bold text-orange-600">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Ingresos</h2>
          <p className="text-3xl font-bold text-green-600">$450,000</p>
        </div>
      </div>
    </div>
  );
};

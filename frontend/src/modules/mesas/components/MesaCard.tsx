import React from 'react';

interface MesaCardProps {
  mesaId: number;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
  onClick?: () => void;
}

export const MesaCard: React.FC<MesaCardProps> = ({
  number,
  status,
  capacity,
  onClick,
}) => {
  const statusColors = {
    available: 'bg-green-100 border-green-500',
    occupied: 'bg-red-100 border-red-500',
    reserved: 'bg-yellow-100 border-yellow-500',
  };

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 cursor-pointer transition-transform hover:scale-105 ${statusColors[status]}`}
    >
      <h3 className="text-2xl font-bold">Mesa {number}</h3>
      <p className="text-sm">Capacidad: {capacity}</p>
      <p className="text-xs mt-2 capitalize">{status}</p>
    </div>
  );
};

import React from 'react';

interface DriverMarkerProps {
  driverId: string;
  name: string;
  latitude: number;
  longitude: number;
  status?: 'available' | 'assigned' | 'in_delivery';
}

export const DriverMarker: React.FC<DriverMarkerProps> = ({
  driverId,
  name,
  latitude,
  longitude,
  status = 'available',
}) => {
  const statusColors = {
    available: 'bg-green-500',
    assigned: 'bg-yellow-500',
    in_delivery: 'bg-blue-500',
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow">
      <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-500">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </p>
      </div>
    </div>
  );
};

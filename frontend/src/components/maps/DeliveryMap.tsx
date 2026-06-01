import React from 'react';

interface DeliveryMapProps {
  driverId?: string;
  latitude?: number;
  longitude?: number;
  destination?: { lat: number; lng: number };
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  driverId,
  latitude,
  longitude,
  destination,
}) => {
  return (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 font-semibold mb-2">🗺️ Mapa de Entregas</p>
        <p className="text-sm text-gray-500">
          {latitude && longitude
            ? `Ubicación: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : 'Esperando ubicación...'}
        </p>
        {destination && (
          <p className="text-sm text-gray-500 mt-1">
            Destino: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
};

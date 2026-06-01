import React from 'react';

interface OfflineBannerProps {
  isOnline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center">
      <p className="text-sm font-semibold">📡 Sin conexión a internet</p>
      <p className="text-xs">Los cambios se sincronizarán cuando recuperes la conexión</p>
    </div>
  );
};

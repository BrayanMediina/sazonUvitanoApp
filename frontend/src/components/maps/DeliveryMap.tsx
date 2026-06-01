interface DeliveryMapProps {
  latitude?: number
  longitude?: number
  destination?: { lat: number; lng: number }
}

export default function DeliveryMap({ latitude, longitude, destination }: DeliveryMapProps) {
  return (
    <div className="w-full h-64 bg-stone-100 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <p className="text-stone-500 font-semibold mb-1">🗺️ Mapa de Entregas</p>
        <p className="text-xs text-stone-400">
          {latitude && longitude
            ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : 'Esperando ubicación…'}
        </p>
        {destination && (
          <p className="text-xs text-stone-400 mt-0.5">
            Destino: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  )
}

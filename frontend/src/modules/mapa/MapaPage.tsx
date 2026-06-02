import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Layout from '../../components/layout/Layout'
import { useAppStore, type AppStore } from '../../store'
import { useDeliveries } from '../../hooks/useDeliveries'
import { formatTime } from '../../utils/formatDate'
import type { Delivery, LocationUpdate } from '../../types'

const BOGOTA: [number, number] = [4.711, -74.0721]

// Icono domiciliario activo (entrega en camino)
const driverIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.35))">🛵</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

// Icono "mi ubicación" — punto naranja sólido con anillo exterior
const myIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:22px;height:22px">
    <div style="position:absolute;inset:0;background:#f9731640;border-radius:50%;border:2px solid #f97316"></div>
    <div style="position:absolute;inset:5px;background:#f97316;border-radius:50%;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,.45)"></div>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

// Mueve el mapa hacia una posición (componente hijo del MapContainer)
function FlyTo({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), 15), { animate: true, duration: 1.2 })
  }, [map, position])
  return null
}

export default function MapaPage() {
  const user            = useAppStore((s) => (s as AppStore).user)
  const deliveries      = useAppStore((s) => (s as AppStore).deliveries)
  const driverLocations = useAppStore((s) => (s as AppStore).driverLocations)

  // Posición GPS propia (solo domiciliario)
  const [ownPosition, setOwnPosition] = useState<[number, number] | null>(null)

  useDeliveries() // asegura que las entregas estén en el store

  useEffect(() => {
    if (user?.role !== 'domiciliario') return
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setOwnPosition([pos.coords.latitude, pos.coords.longitude]),
      () => { /* silencioso si el usuario deniega */ },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [user?.role])

  const activeDrivers = (deliveries as Delivery[])
    .filter((d) => d.status === 'en_camino')
    .map((d) => {
      const socketLoc = d.driverId ? driverLocations[d.driverId] : undefined
      const loc: LocationUpdate | undefined = socketLoc ?? (
        d.currentLat != null && d.currentLng != null && d.driverId
          ? { driverId: d.driverId, lat: d.currentLat, lng: d.currentLng, timestamp: new Date(d.updatedAt).getTime() }
          : undefined
      )
      return { delivery: d, loc }
    })
    .filter((x) => x.loc)

  return (
    <Layout title="Mapa GPS">
      {/* Tarjetas horizontales de domiciliarios activos */}
      {activeDrivers.length > 0 && (
        <div className="px-5 pt-4 pb-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {activeDrivers.map(({ delivery, loc }) => (
              <div key={delivery.id} className="shrink-0 bg-white border border-stone-100 rounded-2xl px-3 py-2 min-w-44">
                <p className="text-xs font-semibold text-stone-800 truncate">🛵 {delivery.driver?.name ?? 'Domiciliario'}</p>
                <p className="text-[10px] text-stone-400 truncate">{delivery.customerName}</p>
                {loc && (
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    Actualizado: {formatTime(new Date(loc.timestamp))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mapa */}
      <div className="px-5 pb-6">
        <div className="rounded-2xl overflow-hidden border border-stone-100" style={{ height: 'calc(100dvh - 200px)' }}>
          <MapContainer
            center={BOGOTA}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcadores de domiciliarios con entregas activas */}
            {activeDrivers.map(({ delivery, loc }) =>
              loc ? (
                <Marker key={delivery.id} position={[loc.lat, loc.lng]} icon={driverIcon}>
                  <Popup>
                    <p className="font-semibold text-sm">{delivery.driver?.name ?? 'Domiciliario'}</p>
                    <p className="text-xs text-gray-600">📦 {delivery.customerName}</p>
                    <p className="text-xs text-gray-400">
                      {formatTime(new Date(loc.timestamp))}
                    </p>
                  </Popup>
                </Marker>
              ) : null
            )}

            {/* Marcador y auto-pan de la posición propia (domiciliario) */}
            {user?.role === 'domiciliario' && ownPosition && (
              <>
                <FlyTo position={ownPosition} />
                <Marker position={ownPosition} icon={myIcon}>
                  <Popup>
                    <p className="font-semibold text-sm">📍 Tu ubicación</p>
                    <p className="text-xs text-gray-400">
                      {ownPosition[0].toFixed(5)}, {ownPosition[1].toFixed(5)}
                    </p>
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        {activeDrivers.length === 0 && user?.role !== 'domiciliario' && (
          <div className="mt-4 text-center">
            <p className="text-sm text-stone-400">Sin domiciliarios en camino</p>
          </div>
        )}
      </div>

      {/* Indicador GPS activo para domiciliario */}
      {user?.role === 'domiciliario' && (
        <div className="fixed bottom-24 right-5 bg-white border border-stone-100 rounded-full px-3 py-2 flex items-center gap-2 shadow-soft">
          <span className={`h-2 w-2 rounded-full ${ownPosition ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-medium text-stone-700">
            {ownPosition ? 'GPS activo' : 'Buscando señal…'}
          </span>
        </div>
      )}
    </Layout>
  )
}

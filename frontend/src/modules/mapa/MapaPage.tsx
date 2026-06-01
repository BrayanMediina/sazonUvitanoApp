import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Layout from '../../components/layout/Layout'
import { useAppStore, type AppStore } from '../../store'
import { formatTime } from '../../utils/formatDate'

const BOGOTA: [number, number] = [4.711, -74.0721]

const driverIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">🛵</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
})

export default function MapaPage() {
  const user            = useAppStore((s) => (s as AppStore).user)
  const deliveries      = useAppStore((s) => (s as AppStore).deliveries)
  const driverLocations = useAppStore((s) => (s as AppStore).driverLocations)

  const activeDrivers = (deliveries as import('../../types').Delivery[])
    .filter((d) => d.status === 'en_camino')
    .map((d) => ({
      delivery: d,
      loc: d.driverId ? driverLocations[d.driverId] : undefined,
    }))
    .filter((x) => x.loc)

  return (
    <Layout title="Mapa GPS">
      {/* Cards horizontales de domiciliarios activos */}
      {activeDrivers.length > 0 && (
        <div className="px-5 pt-4 pb-3">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {activeDrivers.map(({ delivery, loc }) => (
              <div key={delivery.id} className="shrink-0 bg-white border border-stone-100 rounded-2xl px-3 py-2 min-w-40">
                <p className="text-xs font-semibold text-stone-800 truncate">{delivery.driver?.name ?? 'Domiciliario'}</p>
                <p className="text-[10px] text-stone-400 truncate">{delivery.customerName}</p>
                {loc && (
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {formatTime(new Date(loc.timestamp))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mapa Leaflet */}
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
            {activeDrivers.map(({ delivery, loc }) => (
              loc ? (
                <Marker
                  key={delivery.id}
                  position={[loc.lat, loc.lng]}
                  icon={driverIcon}
                >
                  <Popup>
                    <div>
                      <p className="font-semibold">{delivery.driver?.name}</p>
                      <p className="text-xs">Para: {delivery.customerName}</p>
                      <p className="text-xs text-gray-500">
                        Actualizado: {formatTime(new Date(loc.timestamp))}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>

        {activeDrivers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-2xl px-4 py-3 text-center">
              <p className="text-sm text-stone-500">Sin domiciliarios activos</p>
            </div>
          </div>
        )}
      </div>

      {/* Indicador GPS para domiciliario */}
      {user?.role === 'domiciliario' && (
        <div className="fixed bottom-24 right-5 bg-white border border-stone-100 rounded-full px-3 py-2 flex items-center gap-2 shadow-soft">
          <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-stone-700">GPS activo</span>
        </div>
      )}
    </Layout>
  )
}

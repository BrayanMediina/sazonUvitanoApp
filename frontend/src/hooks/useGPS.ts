import { useEffect } from 'react'
import { useAppStore } from '../store'
import { emitLocation } from '../sockets/socketService'
import { deliveriesService } from '../services/api'

export function useGPS() {
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    if (user?.role !== 'domiciliario') return
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        emitLocation(pos.coords.latitude, pos.coords.longitude)
        deliveriesService.updateLocation(pos.coords.latitude, pos.coords.longitude).catch(() => {})
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [user?.role])
}

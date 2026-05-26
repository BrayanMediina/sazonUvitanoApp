import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { appConfig } from '../config'
import { useAppStore } from '../store'

export function useGeoTracking() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    const socket = io(appConfig.socketUrl)
    socketRef.current = socket

    if (!('geolocation' in navigator)) {
      return () => socket.disconnect()
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }

        useAppStore.getState().setLocation(location)
        socket.emit('delivery-location', location)
      },
      (error) => {
        console.warn('Geolocalización no disponible:', error.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
      socket.disconnect()
    }
  }, [])
}

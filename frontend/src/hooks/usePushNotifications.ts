import { useEffect } from 'react'
import { useAppStore } from '../store'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64  = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw  = atob(b64)
  return Uint8Array.from(Array.from(raw).map((c) => c.charCodeAt(0)))
}

async function fetchVapidKey(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/push/vapid-public-key`)
    const json = await res.json() as { success: boolean; data: { publicKey: string | null } }
    return json.data?.publicKey ?? null
  } catch {
    return null
  }
}

async function subscribeDevice(token: string): Promise<void> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  try {
    const reg = await navigator.serviceWorker.ready

    // Si ya hay suscripción activa no volver a suscribir
    const existing = await reg.pushManager.getSubscription()
    if (existing) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const vapidKey = await fetchVapidKey()
    if (!vapidKey) return

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    await fetch(`${API_URL}/api/push/subscribe`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify(sub.toJSON()),
    })
  } catch (err) {
    console.warn('[Push] Suscripción fallida:', err)
  }
}

export function usePushNotifications() {
  const user  = useAppStore((s) => s.user)
  const token = useAppStore((s) => s.accessToken)

  useEffect(() => {
    if (!user || !token) return
    subscribeDevice(token)
  }, [user?.id, token]) // eslint-disable-line react-hooks/exhaustive-deps
}

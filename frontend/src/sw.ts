/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { clientsClaim } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope

// ─── AUTO-UPDATE ─────────────────────────────────────────────
// Con injectManifest + registerType:'autoUpdate', vite-plugin-pwa envía
// el mensaje SKIP_WAITING. Hay que responderlo Y llamar skipWaiting
// directamente para que el nuevo SW tome control inmediatamente.
self.skipWaiting()
clientsClaim()

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// ─── PRECACHE ────────────────────────────────────────────────
// VitePWA inyecta el manifiesto de precaché aquí en build time
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// ─── NAVEGACIÓN SPA ──────────────────────────────────────────
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//, /^\/sw\.js/, /\/__vite/],
  }),
)

// ─── CACHÉ DE API ────────────────────────────────────────────
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/products'),
  new StaleWhileRevalidate({
    cacheName: 'api-products',
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 3_600 })],
  }),
)

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/orders'),
  new NetworkFirst({ cacheName: 'api-orders' }),
)

// ─── TESELAS DE MAPA ─────────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'map-tiles',
    plugins: [new ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 604_800 })],
  }),
)

// ─── PUSH NOTIFICATIONS ──────────────────────────────────────
self.addEventListener('push', (event) => {
  let data: { title?: string; body?: string; icon?: string; badge?: string; url?: string } = {}
  try { data = event.data?.json() ?? {} } catch { /* vacío */ }

  const title   = data.title ?? 'El Sazón Uvitano'
  const options = {
    body:    data.body  ?? '',
    icon:    data.icon  ?? '/icons/icon-192.svg',
    badge:   data.badge ?? '/icons/icon-192.svg',
    data:    { url: data.url ?? '/' },
    vibrate: [150, 80, 150],
    requireInteraction: false,
  } as NotificationOptions

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data as { url?: string })?.url ?? '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const found = list.find((c) => c.url.startsWith(self.location.origin))
      if (found) {
        found.focus()
        return (found as WindowClient).navigate(url)
      }
      return self.clients.openWindow(url)
    }),
  )
})

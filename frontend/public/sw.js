// Service Worker — El Sazón Uvitano
// Maneja notificaciones push VAPID

self.addEventListener('push', (event) => {
  let data = {}
  try { data = event.data?.json() ?? {} } catch { /* vacío */ }

  const title   = data.title   ?? 'El Sazón Uvitano'
  const options = {
    body:    data.body    ?? '',
    icon:    data.icon    ?? '/icons/icon-192.svg',
    badge:   data.badge   ?? '/icons/icon-192.svg',
    data:    { url: data.url ?? '/' },
    vibrate: [150, 80, 150],
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin))
      if (existing) {
        existing.focus()
        existing.navigate(url)
      } else {
        clients.openWindow(url)
      }
    })
  )
})

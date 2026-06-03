import { useState, useRef, useEffect } from 'react'
import { useAppStore, type AppStore } from '../../store'
import { formatRelative } from '../../utils/formatDate'
import type { NotificationType } from '../../types'

const TYPE_ICON: Record<NotificationType, string> = {
  nuevo_pedido:    '🍽️',
  pedido_listo:    '✅',
  nuevo_domicilio: '🛵',
  mensaje:         '💬',
  alerta:          '⚠️',
  pago:            '💳',
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const count         = useAppStore((s) => (s as AppStore).unreadNotifications)
  const notifications = useAppStore((s) => (s as AppStore).notifications)
  const markRead      = useAppStore((s) => (s as AppStore).markNotificationRead)

  // Cerrar al tocar fuera
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  const recent = notifications.slice(0, 8)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative min-w-10 min-h-10 flex items-center justify-center rounded-xl active:bg-stone-100 transition-colors"
        aria-label={`Notificaciones${count > 0 ? ` (${count} nuevas)` : ''}`}
      >
        <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-50">
          {/* Encabezado */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-900">Notificaciones</p>
            {count > 0 && (
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {count} nueva{count > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-3xl">🔔</span>
                <p className="text-sm text-stone-400">Sin notificaciones</p>
              </div>
            ) : (
              recent.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markRead(n.id); setOpen(false) }}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors active:bg-stone-50 ${
                    !n.read ? 'bg-brand-50' : 'bg-white'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{TYPE_ICON[n.type] ?? '📢'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${!n.read ? 'text-brand-900' : 'text-stone-700'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="shrink-0 h-2 w-2 mt-1.5 bg-brand-700 rounded-full" />
                  )}
                </button>
              ))
            )}
          </div>

          {recent.length > 0 && (
            <div className="border-t border-stone-100 px-4 py-2.5">
              <p className="text-[10px] text-stone-400 text-center">
                Toca una notificación para marcarla como leída
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { NotificationBell }

// ============================================================
// SOCKET SERVICE — El Sazón Uvitano PWA
// ============================================================
import { io, Socket } from 'socket.io-client'
import { useAppStore, type AppStore } from '../store'
import type { ChatMessage, Order, Table, Delivery, LocationUpdate } from '../types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

let socket: Socket | null = null

// Helper: estado fresco en cada evento (nunca captura snapshot stale)
const store = () => useAppStore.getState() as AppStore

// ─── EVENTOS ─────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  ORDER_CREATED:    'order:created',
  ORDER_UPDATED:    'order:updated',
  ORDER_STATUS:     'order:status',
  TABLE_UPDATED:    'table:updated',
  DELIVERY_CREATED: 'delivery:created',
  DELIVERY_UPDATED: 'delivery:updated',
  LOCATION_UPDATE:  'delivery:location',
  NEW_MESSAGE:      'chat:message',
  PAYMENT_DONE:     'payment:completed',
  CONNECT:          'connect',
  DISCONNECT:       'disconnect',
  ERROR:            'connect_error',
} as const

// ─── INICIALIZAR ──────────────────────────────────────────────
export function initSocket(token: string): Socket {
  if (socket?.active || socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    // polling primero: handshake HTTP más estable, luego upgrade a WS
    transports: ['polling', 'websocket'],
    reconnectionAttempts: Infinity,   // nunca abandonar — Render puede tardar 30 s
    reconnectionDelay:    1_000,
    reconnectionDelayMax: 30_000,
    timeout:              20_000,
  })

  // ── Pedidos ────────────────────────────────────────────────
  // El servidor emite { order } — destructuramos el wrapper
  socket.on(SOCKET_EVENTS.ORDER_CREATED, ({ order }: { order: Order }) => {
    const s = store()
    if (s.orders.some((o) => o.id === order.id)) return   // dedup
    s.setOrders([order, ...s.orders])
    s.addNotification({
      id: crypto.randomUUID(),
      type: 'nuevo_pedido',
      title: 'Nuevo pedido',
      body: `${order.table ? `Mesa ${order.table.number}` : 'Domicilio'} — $${order.total.toLocaleString('es-CO')}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  })

  socket.on(SOCKET_EVENTS.ORDER_UPDATED, ({ order }: { order: Order }) => {
    store().updateOrder(order.id, order)
  })

  socket.on(SOCKET_EVENTS.ORDER_STATUS, ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
    store().updateOrder(orderId, { status })
  })

  // ── Mesas ──────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.TABLE_UPDATED, ({ table }: { table: Table }) => {
    store().updateTable(table.id, table)
  })

  // ── Domicilios ─────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.DELIVERY_CREATED, ({ delivery }: { delivery: Delivery }) => {
    const s = store()
    if (s.deliveries.some((d) => d.id === delivery.id)) return   // dedup
    s.setDeliveries([delivery, ...s.deliveries])
    s.addNotification({
      id: crypto.randomUUID(),
      type: 'nuevo_domicilio',
      title: 'Nuevo domicilio',
      body: `Para ${delivery.customerName}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  })

  socket.on(SOCKET_EVENTS.DELIVERY_UPDATED, ({ delivery }: { delivery: Delivery }) => {
    store().updateDelivery(delivery.id, delivery)
  })

  socket.on(SOCKET_EVENTS.LOCATION_UPDATE, (update: LocationUpdate) => {
    store().updateDriverLocation(update)
  })

  // ── Chat ───────────────────────────────────────────────────
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (data: { message: ChatMessage }) => {
    store().addMessage(data.message ?? (data as unknown as ChatMessage))
  })

  // ── Estado de conexión ─────────────────────────────────────
  socket.on(SOCKET_EVENTS.CONNECT, () => {
    store().setOnline(true)
    console.info('[Socket] Conectado:', socket?.id)
  })

  socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
    store().setOnline(false)
    console.warn('[Socket] Desconectado:', reason)
  })

  socket.on(SOCKET_EVENTS.ERROR, (err) => {
    console.warn('[Socket] Error de conexión:', err.message)
  })

  return socket
}

// ─── EMITIR ───────────────────────────────────────────────────
export function emitLocation(lat: number, lng: number) {
  socket?.emit('driver:location', { lat, lng, timestamp: Date.now() })
}

export function emitChatMessage(content: string, clientId?: string) {
  socket?.emit('chat:send', { content, clientId })
}

// ─── DESCONECTAR ──────────────────────────────────────────────
export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

export function getSocket() { return socket }

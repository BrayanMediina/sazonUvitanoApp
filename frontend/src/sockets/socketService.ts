// ============================================================
// SOCKET SERVICE — El Sazón Uvitano PWA
// src/sockets/socketService.ts  (Socket.IO client)
// ============================================================
import { io, Socket } from 'socket.io-client'
import { useAppStore, type AppStore } from '../store'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

let socket: Socket | null = null

// ─── EVENTOS DE ENTRADA (servidor → cliente) ──────────────────
export const SOCKET_EVENTS = {
  // Pedidos
  ORDER_CREATED:    'order:created',
  ORDER_UPDATED:    'order:updated',
  ORDER_STATUS:     'order:status',

  // Mesas
  TABLE_UPDATED:    'table:updated',

  // Domicilios
  DELIVERY_CREATED: 'delivery:created',
  DELIVERY_UPDATED: 'delivery:updated',
  LOCATION_UPDATE:  'delivery:location',

  // Chat
  NEW_MESSAGE:      'chat:message',

  // Pagos
  PAYMENT_DONE:     'payment:completed',

  // Sistema
  CONNECT:          'connect',
  DISCONNECT:       'disconnect',
  ERROR:            'connect_error',
} as const

// ─── INICIALIZAR ──────────────────────────────────────────────
export function initSocket(token: string): Socket {
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  })

  const store = useAppStore.getState() as AppStore

  socket.on(SOCKET_EVENTS.ORDER_CREATED, (order) => {
    store.setOrders([order, ...store.orders])
    store.addNotification({
      id: crypto.randomUUID(),
      type: 'nuevo_pedido',
      title: 'Nuevo pedido',
      body: `Mesa ${order.table?.number ?? 'domicilio'} — $${order.total}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  })

  socket.on(SOCKET_EVENTS.ORDER_UPDATED, (order) => {
    store.updateOrder(order.id, order)
  })

  socket.on(SOCKET_EVENTS.TABLE_UPDATED, (table) => {
    store.updateTable(table.id, table)
  })

  socket.on(SOCKET_EVENTS.DELIVERY_CREATED, (delivery) => {
    store.setDeliveries([delivery, ...store.deliveries])
    store.addNotification({
      id: crypto.randomUUID(),
      type: 'nuevo_domicilio',
      title: 'Nuevo domicilio',
      body: `Para ${delivery.customerName}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
  })

  socket.on(SOCKET_EVENTS.DELIVERY_UPDATED, (delivery) => {
    store.updateDelivery(delivery.id, delivery)
  })

  socket.on(SOCKET_EVENTS.LOCATION_UPDATE, (update) => {
    store.updateDriverLocation(update)
  })

  socket.on(SOCKET_EVENTS.NEW_MESSAGE, (msg) => {
    store.addMessage(msg)
  })

  socket.on(SOCKET_EVENTS.CONNECT, () => {
    store.setOnline(true)
  })

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    store.setOnline(false)
  })

  return socket
}

// ─── EMITIR UBICACIÓN GPS ─────────────────────────────────────
export function emitLocation(lat: number, lng: number) {
  socket?.emit('driver:location', { lat, lng, timestamp: Date.now() })
}

// ─── EMITIR MENSAJE CHAT ──────────────────────────────────────
export function emitChatMessage(content: string) {
  socket?.emit('chat:send', { content })
}

// ─── DESCONECTAR ──────────────────────────────────────────────
export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

// ─── HOOK DE ACCESO AL SOCKET ─────────────────────────────────
export function getSocket() { return socket }
import { create } from 'zustand'
import type { Role } from './config'

export type TableStatus = 'Disponible' | 'Ocupada' | 'Pendiente pago'
export type OrderStatus = 'Pedido tomado' | 'En preparación' | 'Listo' | 'Entregado' | 'Pagado' | 'Finalizado'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: Role
}

export interface TableCard {
  id: string
  number: number
  status: TableStatus
  seats: number
}

export interface OrderCard {
  id: string
  tableId: string
  status: OrderStatus
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
  createdAt: string
}

export interface DeliveryCard {
  id: string
  orderId: string
  status: 'Asignado' | 'En camino' | 'Entregado'
  driverName: string
  lat: number
  lng: number
}

export interface ChatMessage {
  id: string
  author: string
  text: string
  role: Role | 'sistema'
  createdAt: string
}

interface AppState {
  user: UserProfile | null
  token: string | null
  tables: TableCard[]
  orders: OrderCard[]
  deliveries: DeliveryCard[]
  messages: ChatMessage[]
  location: { lat: number; lng: number } | null
  isOnline: boolean
  setUser: (user: UserProfile | null, token?: string | null) => void
  setTables: (tables: TableCard[]) => void
  setOrders: (orders: OrderCard[]) => void
  setDeliveries: (deliveries: DeliveryCard[]) => void
  addMessage: (message: ChatMessage) => void
  setLocation: (location: { lat: number; lng: number }) => void
  setOnline: (isOnline: boolean) => void
}

const initialTables: TableCard[] = [
  { id: 'table-1', number: 1, status: 'Disponible', seats: 4 },
  { id: 'table-2', number: 2, status: 'Ocupada', seats: 2 },
  { id: 'table-3', number: 3, status: 'Pendiente pago', seats: 6 }
]

const initialOrders: OrderCard[] = [
  {
    id: 'order-1',
    tableId: 'table-2',
    status: 'En preparación',
    total: 48000,
    items: [{ name: 'Ceviche', quantity: 1, price: 28000 }],
    createdAt: '2026-05-26T12:00:00.000Z'
  }
]

const initialDeliveries: DeliveryCard[] = [
  { id: 'delivery-1', orderId: 'order-1', status: 'En camino', driverName: 'Camilo', lat: 4.6987, lng: -74.1113 }
]

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: null,
  tables: initialTables,
  orders: initialOrders,
  deliveries: initialDeliveries,
  messages: [
    {
      id: 'message-1',
      author: 'Sistémico',
      text: 'Bienvenido a El Sazón Uvitano. Operación iniciada.',
      role: 'sistema',
      createdAt: new Date().toISOString()
    }
  ],
  location: null,
  isOnline: navigator.onLine,
  setUser: (user, token) => set({ user, token: token ?? null }),
  setTables: (tables) => set({ tables }),
  setOrders: (orders) => set({ orders }),
  setDeliveries: (deliveries) => set({ deliveries }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLocation: (location) => set({ location }),
  setOnline: (isOnline) => set({ isOnline })
}))

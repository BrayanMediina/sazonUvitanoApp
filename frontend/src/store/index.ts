// ============================================================
// STORE GLOBAL — El Sazón Uvitano PWA
// src/store/index.ts  (Zustand)
// ============================================================
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User, Order, Table, Delivery, ChatMessage,
  AppNotification, LocationUpdate
} from '../types'

// ─── AUTH SLICE ──────────────────────────────────────────────
interface AuthSlice {
  user: User | null
  accessToken: string | null
  setUser: (user: User, token: string) => void
  clearAuth: () => void
}

// ─── MESAS SLICE ─────────────────────────────────────────────
interface TablesSlice {
  tables: Table[]
  setTables: (tables: Table[]) => void
  updateTable: (id: string, data: Partial<Table>) => void
}

// ─── PEDIDOS SLICE ───────────────────────────────────────────
interface OrdersSlice {
  orders: Order[]
  activeOrder: Order | null
  setOrders: (orders: Order[]) => void
  setActiveOrder: (order: Order | null) => void
  updateOrder: (id: string, data: Partial<Order>) => void
}

// ─── DOMICILIOS SLICE ────────────────────────────────────────
interface DeliveriesSlice {
  deliveries: Delivery[]
  driverLocations: Record<string, LocationUpdate>
  setDeliveries: (deliveries: Delivery[]) => void
  updateDelivery: (id: string, data: Partial<Delivery>) => void
  updateDriverLocation: (update: LocationUpdate) => void
}

// ─── CHAT SLICE ──────────────────────────────────────────────
interface ChatSlice {
  messages: ChatMessage[]
  unreadCount: number
  addMessage: (msg: ChatMessage) => void
  markAllRead: () => void
}

// ─── NOTIFICATIONS SLICE ─────────────────────────────────────
interface NotificationsSlice {
  notifications: AppNotification[]
  unreadNotifications: number
  addNotification: (n: AppNotification) => void
  markNotificationRead: (id: string) => void
}

// ─── UI SLICE ────────────────────────────────────────────────
interface UISlice {
  isOnline: boolean
  pendingSyncCount: number
  setOnline: (v: boolean) => void
  incrementPending: () => void
  decrementPending: () => void
}

// ─── STORE COMPLETO ──────────────────────────────────────────
export type AppStore = AuthSlice & TablesSlice & OrdersSlice &
  DeliveriesSlice & ChatSlice & NotificationsSlice & UISlice

type PersistedState = Pick<AppStore, 'user' | 'accessToken'>

export const useAppStore = create<AppStore>()(
  persist<AppStore, [], [], PersistedState>(
    (set) => ({
      // AUTH
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => set({ user, accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),

      // TABLES
      tables: [],
      setTables: (tables) => set({ tables }),
      updateTable: (id, data) =>
        set((s) => ({
          tables: s.tables.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      // ORDERS
      orders: [],
      activeOrder: null,
      setOrders: (orders) => set({ orders }),
      setActiveOrder: (activeOrder) => set({ activeOrder }),
      updateOrder: (id, data) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, ...data } : o)),
        })),

      // DELIVERIES
      deliveries: [],
      driverLocations: {},
      setDeliveries: (deliveries) => set({ deliveries }),
      updateDelivery: (id, data) =>
        set((s) => ({
          deliveries: s.deliveries.map((d) =>
            d.id === id ? { ...d, ...data } : d
          ),
        })),
      updateDriverLocation: (update) =>
        set((s) => ({
          driverLocations: {
            ...s.driverLocations,
            [update.driverId]: update,
          },
        })),

      // CHAT
      messages: [],
      unreadCount: 0,
      addMessage: (msg) =>
        set((s) => ({
          messages: [...s.messages.slice(-100), msg],
          unreadCount: s.unreadCount + 1,
        })),
      markAllRead: () => set({ unreadCount: 0 }),

      // NOTIFICATIONS
      notifications: [],
      unreadNotifications: 0,
      addNotification: (n) =>
        set((s) => ({
          notifications: [n, ...s.notifications.slice(0, 49)],
          unreadNotifications: s.unreadNotifications + 1,
        })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadNotifications: Math.max(0, s.unreadNotifications - 1),
        })),

      // UI
      isOnline: true,
      pendingSyncCount: 0,
      setOnline: (isOnline) => set({ isOnline }),
      incrementPending: () =>
        set((s) => ({ pendingSyncCount: s.pendingSyncCount + 1 })),
      decrementPending: () =>
        set((s) => ({ pendingSyncCount: Math.max(0, s.pendingSyncCount - 1) })),
    }),
    {
      name: 'sazon-store',
      // Solo persistir auth y config básica, NO datos sensibles
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
      }),
    }
  )
)
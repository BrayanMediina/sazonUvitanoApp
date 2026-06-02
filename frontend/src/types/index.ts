// ============================================================
// TIPOS GLOBALES — El Sazón Uvitano PWA
// src/types/index.ts
// ============================================================

// ─── ROLES ──────────────────────────────────────────────────
export type Role = 'administrador' | 'cajero' | 'mesero' | 'domiciliario'

// ─── USUARIO ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  document: string
  email?: string
  phone?: string
  role: Role
  isActive: boolean
  createdAt: string
}

// ─── AUTH ────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ─── MESA ────────────────────────────────────────────────────
export type TableStatus = 'disponible' | 'ocupada' | 'pendiente_pago'

export interface Table {
  id: string
  number: number
  status: TableStatus
  capacity?: number
  currentOrderId?: string
  zone?: string
}

// ─── PRODUCTO ────────────────────────────────────────────────
export type ProductCategory =
  | 'entrada'
  | 'plato_principal'
  | 'bebida'
  | 'postre'
  | 'especial'
  | 'domicilio'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: ProductCategory
  imageUrl?: string
  isAvailable: boolean
  isActive: boolean
}

// ─── PEDIDO ──────────────────────────────────────────────────
export type OrderStatus =
  | 'tomado'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'pagado'
  | 'finalizado'
  | 'cancelado'

export type OrderType = 'mesa' | 'domicilio'

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  unitPrice: number
  subtotal: number
  notes?: string
}

export interface Order {
  id: string
  type: OrderType
  tableId?: string
  table?: Table
  items: OrderItem[]
  status: OrderStatus
  total: number
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// ─── PAGO ────────────────────────────────────────────────────
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'nequi' | 'daviplata'

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  receivedAmount?: number
  change?: number
  paidAt: string
  cashierId: string
}

// ─── DOMICILIO ───────────────────────────────────────────────
export type DeliveryStatus =
  | 'pendiente'
  | 'asignado'
  | 'en_camino'
  | 'entregado'
  | 'cancelado'

export interface DeliveryAddress {
  street: string
  neighborhood?: string
  reference?: string
  lat?: number
  lng?: number
}

export interface Delivery {
  id: string
  orderId: string
  order: Order
  driverId?: string
  driver?: User
  status: DeliveryStatus
  // Campos de dirección planos (tal como los devuelve el backend/Prisma)
  street: string
  neighborhood?: string
  reference?: string
  addressLat?: number
  addressLng?: number
  currentLat?: number
  currentLng?: number
  estimatedTime?: number
  customerName: string
  customerPhone: string
  createdAt: string
  updatedAt: string
}

// ─── GPS ─────────────────────────────────────────────────────
export interface LocationUpdate {
  driverId: string
  lat: number
  lng: number
  timestamp: number
}

// ─── CHAT ────────────────────────────────────────────────────
export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: Role
  content: string
  timestamp: string
  read: boolean
}

// ─── REPORTES ────────────────────────────────────────────────
export interface DailySummary {
  date: string
  totalOrders: number
  totalRevenue: number
  totalDeliveries: number
  paymentBreakdown: Record<PaymentMethod, number>
  topProducts: { product: Product; quantity: number }[]
  ordersByStatus: Record<OrderStatus, number>
  averageTicket: number
}

// ─── NOTIFICACIONES ──────────────────────────────────────────
export type NotificationType =
  | 'nuevo_pedido'
  | 'pedido_listo'
  | 'nuevo_domicilio'
  | 'mensaje'
  | 'alerta'
  | 'pago'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
  payload?: Record<string, unknown>
}

// ─── API GENÉRICO ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}
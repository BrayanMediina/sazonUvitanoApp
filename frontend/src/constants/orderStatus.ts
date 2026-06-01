// ============================================================
// CONSTANTES — El Sazón Uvitano PWA
// ============================================================

// ─── src/constants/orderStatus.ts ────────────────────────────
import type { OrderStatus, TableStatus, DeliveryStatus } from '../types'

export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string
  color: string       // Tailwind bg class
  textColor: string   // Tailwind text class
  borderColor: string
  next?: OrderStatus  // siguiente estado lógico
}> = {
  tomado:          { label: 'Tomado',          color: 'bg-stone-100',   textColor: 'text-stone-700',  borderColor: 'border-stone-200',  next: 'en_preparacion' },
  en_preparacion:  { label: 'En preparación',  color: 'bg-orange-100',  textColor: 'text-orange-700', borderColor: 'border-orange-200', next: 'listo' },
  listo:           { label: 'Listo',           color: 'bg-green-100',   textColor: 'text-green-700',  borderColor: 'border-green-200',  next: 'entregado' },
  entregado:       { label: 'Entregado',       color: 'bg-blue-100',    textColor: 'text-blue-700',   borderColor: 'border-blue-200',   next: 'pagado' },
  pagado:          { label: 'Pagado',          color: 'bg-emerald-100', textColor: 'text-emerald-700',borderColor: 'border-emerald-200',next: 'finalizado' },
  finalizado:      { label: 'Finalizado',      color: 'bg-stone-200',   textColor: 'text-stone-600',  borderColor: 'border-stone-300' },
  cancelado:       { label: 'Cancelado',       color: 'bg-red-100',     textColor: 'text-red-700',    borderColor: 'border-red-200' },
}

export const TABLE_STATUS_CONFIG: Record<TableStatus, {
  label: string
  color: string
  textColor: string
  dotColor: string
}> = {
  disponible:     { label: 'Disponible',      color: 'bg-green-50',   textColor: 'text-green-700',  dotColor: 'bg-green-400' },
  ocupada:        { label: 'Ocupada',         color: 'bg-red-50',     textColor: 'text-red-700',    dotColor: 'bg-red-400' },
  pendiente_pago: { label: 'Pendiente pago',  color: 'bg-amber-50',   textColor: 'text-amber-700',  dotColor: 'bg-amber-400' },
}

export const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, {
  label: string
  color: string
  textColor: string
  icon: string
}> = {
  pendiente:  { label: 'Pendiente',   color: 'bg-stone-100',  textColor: 'text-stone-700',  icon: '⏳' },
  asignado:   { label: 'Asignado',    color: 'bg-blue-100',   textColor: 'text-blue-700',   icon: '👤' },
  en_camino:  { label: 'En camino',   color: 'bg-orange-100', textColor: 'text-orange-700', icon: '🛵' },
  entregado:  { label: 'Entregado',   color: 'bg-green-100',  textColor: 'text-green-700',  icon: '✅' },
  cancelado:  { label: 'Cancelado',   color: 'bg-red-100',    textColor: 'text-red-700',    icon: '❌' },
}

// ─── src/constants/roles.ts ───────────────────────────────────
import type { Role } from '../types'

export const ROLE_CONFIG: Record<Role, {
  label: string
  color: string
  textColor: string
  icon: string
  description: string
}> = {
  administrador: {
    label: 'Administrador',
    color: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: '⚙️',
    description: 'Acceso completo al sistema'
  },
  cajero: {
    label: 'Cajero',
    color: 'bg-green-100',
    textColor: 'text-green-800',
    icon: '💳',
    description: 'Gestión de caja, pagos y domicilios'
  },
  mesero: {
    label: 'Mesero',
    color: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: '🍽️',
    description: 'Registro de pedidos en mesas'
  },
  domiciliario: {
    label: 'Domiciliario',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: '🛵',
    description: 'Entregas y seguimiento GPS'
  },
}

// ─── src/constants/paymentMethods.ts ─────────────────────────
import type { PaymentMethod } from '../types'

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, {
  label: string
  icon: string
  color: string
}> = {
  efectivo:      { label: 'Efectivo',      icon: '💵', color: 'bg-green-50 border-green-200 text-green-700' },
  tarjeta:       { label: 'Tarjeta',       icon: '💳', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  transferencia: { label: 'Transferencia', icon: '🏦', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  nequi:         { label: 'Nequi',         icon: '📱', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  daviplata:     { label: 'Daviplata',     icon: '🔴', color: 'bg-red-50 border-red-200 text-red-700' },
}

// ─── src/constants/categories.ts ─────────────────────────────
import type { ProductCategory } from '../types'

export const CATEGORY_CONFIG: Record<ProductCategory, {
  label: string
  icon: string
}> = {
  entrada:         { label: 'Entradas',         icon: '🥗' },
  plato_principal: { label: 'Platos principales',icon: '🍲' },
  bebida:          { label: 'Bebidas',           icon: '🥤' },
  postre:          { label: 'Postres',           icon: '🍮' },
  especial:        { label: 'Especiales',        icon: '⭐' },
  domicilio:       { label: 'Solo domicilio',    icon: '🛵' },
}
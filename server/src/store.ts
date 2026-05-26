import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export type Role = 'mesero' | 'cajero' | 'domiciliario' | 'administrador'

export type OrderStatus = 'Pedido tomado' | 'En preparación' | 'Listo' | 'Entregado' | 'Pagado' | 'Finalizado'

export interface UserRecord {
  id: string
  name: string
  document: string
  email: string
  phone?: string
  role: Role
  passwordHash: string
  faceIdEnabled: boolean
  faceId?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
}

export interface TableRecord {
  id: string
  number: number
  status: 'Disponible' | 'Ocupada' | 'Pendiente pago'
  seats: number
}

export interface OrderRecord {
  id: string
  tableId: string
  status: OrderStatus
  total: number
  createdAt: string
  items: Array<{ productId: string; name: string; quantity: number; price: number }>
}

export interface DeliveryRecord {
  id: string
  orderId: string
  driverId: string
  status: 'Asignado' | 'En camino' | 'Entregado'
  currentLat: number
  currentLng: number
  createdAt: string
}

export interface PaymentRecord {
  id: string
  orderId: string
  amount: number
  method: string
  paidAt: string
}

export interface ProductRecord {
  id: string
  name: string
  price: number
  category: string
}

const adminHash = bcrypt.hashSync('123456', 10)

export const store = {
  users: [
    {
      id: 'user-admin',
      name: 'Administrador Sazón',
      document: '123456789',
      email: 'admin@sazonuvitano.com',
      phone: '3101234567',
      role: 'administrador',
      passwordHash: adminHash,
      faceIdEnabled: false,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ] as UserRecord[],
  tables: [
    { id: 'table-1', number: 1, status: 'Disponible', seats: 4 },
    { id: 'table-2', number: 2, status: 'Ocupada', seats: 2 },
    { id: 'table-3', number: 3, status: 'Pendiente pago', seats: 6 }
  ] as TableRecord[],
  products: [
    { id: 'product-1', name: 'Ceviche', price: 28000, category: 'Platos' },
    { id: 'product-2', name: 'Pasta al pesto', price: 24000, category: 'Platos' }
  ] as ProductRecord[],
  orders: [
    {
      id: 'order-1',
      tableId: 'table-2',
      status: 'En preparación',
      total: 48000,
      createdAt: new Date().toISOString(),
      items: [{ productId: 'product-1', name: 'Ceviche', quantity: 1, price: 28000 }]
    }
  ] as OrderRecord[],
  deliveries: [
    { id: 'delivery-1', orderId: 'order-1', driverId: 'driver-1', status: 'En camino', currentLat: 4.6987, currentLng: -74.1113, createdAt: new Date().toISOString() }
  ] as DeliveryRecord[],
  payments: [] as PaymentRecord[]
}

export function getUserByEmail(email: string) {
  return store.users.find((user) => user.email === email)
}

export function getUserByDocument(document: string) {
  return store.users.find((user) => user.document === document)
}

export function getUserById(id: string) {
  return store.users.find((user) => user.id === id)
}

export async function authenticateUserByDocument(document: string, password: string) {
  const user = getUserByDocument(document)
  if (!user || !user.isActive) return null

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return null

  return user
}

export async function createUser(data: {
  name: string
  document: string
  email: string
  phone?: string
  password: string
  role: Role
}) {
  const existingDoc = getUserByDocument(data.document)
  if (existingDoc) throw new Error('Documento ya registrado')

  const existingEmail = getUserByEmail(data.email)
  if (existingEmail) throw new Error('Email ya registrado')

  const user: UserRecord = {
    id: randomUUID(),
    name: data.name,
    document: data.document,
    email: data.email,
    phone: data.phone,
    role: data.role,
    passwordHash: await bcrypt.hash(data.password, 10),
    faceIdEnabled: false,
    isActive: true,
    createdAt: new Date().toISOString()
  }

  store.users.push(user)
  return user
}

export function upsertTable(table: TableRecord) {
  const index = store.tables.findIndex((item) => item.id === table.id)
  if (index >= 0) store.tables[index] = table
  else store.tables.push(table)
}

export function createOrder(order: OrderRecord) {
  store.orders.push(order)
}

export function updateOrder(id: string, patch: Partial<OrderRecord>) {
  const index = store.orders.findIndex((order) => order.id === id)
  if (index >= 0) store.orders[index] = { ...store.orders[index], ...patch }
}

export function createDelivery(delivery: DeliveryRecord) {
  store.deliveries.push(delivery)
}

export function updateDelivery(id: string, patch: Partial<DeliveryRecord>) {
  const index = store.deliveries.findIndex((delivery) => delivery.id === id)
  if (index >= 0) store.deliveries[index] = { ...store.deliveries[index], ...patch }
}

export function createPayment(payment: PaymentRecord) {
  store.payments.push(payment)
}

export function createProduct(product: ProductRecord) {
  store.products.push(product)
}

import { prisma } from '../../config/database.js'
import type { TableStatus } from '@prisma/client'

const INCLUDE = { orders: { where: { status: { in: ['tomado','en_preparacion','listo','entregado'] as any } }, take: 1 } }

export async function getAll() {
  return prisma.table.findMany({ orderBy: { number: 'asc' } })
}

export async function getById(id: string) {
  return prisma.table.findUniqueOrThrow({ where: { id } })
}

export async function create(data: { number: number; capacity?: number; zone?: string }) {
  const exists = await prisma.table.findUnique({ where: { number: data.number } })
  if (exists) throw Object.assign(new Error(`Mesa ${data.number} ya existe`), { status: 409 })
  return prisma.table.create({ data })
}

export async function update(id: string, data: Partial<{ number: number; capacity: number; zone: string }>) {
  return prisma.table.update({ where: { id }, data })
}

export async function updateStatus(id: string, status: TableStatus) {
  return prisma.table.update({ where: { id }, data: { status } })
}

export async function remove(id: string) {
  const table = await prisma.table.findUniqueOrThrow({ where: { id }, include: INCLUDE })
  if (table.orders.length > 0) throw Object.assign(new Error('La mesa tiene un pedido activo'), { status: 422 })
  return prisma.table.delete({ where: { id } })
}

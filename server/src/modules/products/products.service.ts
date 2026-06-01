import { prisma } from '../../config/database.js'
import type { ProductCategory } from '@prisma/client'

export async function getAll(params: { category?: ProductCategory; isAvailable?: string }) {
  const where: Record<string, unknown> = { isActive: true }
  if (params.category) where.category = params.category
  if (params.isAvailable === 'true') where.isAvailable = true
  return prisma.product.findMany({ where, orderBy: [{ category: 'asc' }, { name: 'asc' }] })
}

export async function getById(id: string) {
  return prisma.product.findUniqueOrThrow({ where: { id } })
}

export async function create(data: {
  name: string; description?: string; price: number; category: ProductCategory;
  imageUrl?: string; isAvailable?: boolean
}) {
  return prisma.product.create({ data: { ...data, isActive: true } })
}

export async function update(id: string, data: Partial<{
  name: string; description: string; price: number; category: ProductCategory;
  imageUrl: string; isAvailable: boolean; isActive: boolean
}>) {
  return prisma.product.update({ where: { id }, data })
}

export async function toggleAvailability(id: string) {
  const p = await prisma.product.findUniqueOrThrow({ where: { id } })
  return prisma.product.update({ where: { id }, data: { isAvailable: !p.isAvailable } })
}

export async function remove(id: string) {
  return prisma.product.delete({ where: { id } })
}

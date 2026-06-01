import { prisma }           from '../../config/database.js'
import { hashPassword }     from '../../utils/hash.js'
import { getPagination, paginatedResponse } from '../../utils/pagination.js'
import type { Role }        from '@prisma/client'

const SELECT = { id:true, name:true, document:true, email:true, phone:true, role:true, isActive:true, createdAt:true }

export async function getAll(params: { role?: Role; page?: number; limit?: number; search?: string }) {
  const { page, limit, skip } = getPagination(params)
  const where: Record<string, unknown> = {}
  if (params.role) where.role = params.role
  if (params.search) where.OR = [
    { name:     { contains: params.search, mode: 'insensitive' } },
    { document: { contains: params.search } },
  ]
  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({ where, select: SELECT, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.user.count({ where }),
  ])
  return paginatedResponse(data, total, page, limit)
}

export async function getById(id: string) {
  return prisma.user.findUniqueOrThrow({ where: { id }, select: SELECT })
}

export async function create(data: {
  name: string; document: string; email?: string; phone?: string; password: string; role: Role
}) {
  const exists = await prisma.user.findUnique({ where: { document: data.document } })
  if (exists) throw Object.assign(new Error('Documento ya registrado'), { status: 409 })

  return prisma.user.create({ data: { ...data, password: await hashPassword(data.password) }, select: SELECT })
}

export async function update(id: string, data: Partial<{ name: string; email: string; phone: string; role: Role; isActive: boolean }>) {
  return prisma.user.update({ where: { id }, data, select: SELECT })
}

export async function toggleActive(id: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } })
  return prisma.user.update({ where: { id }, data: { isActive: !user.isActive }, select: SELECT })
}

export async function resetPassword(id: string, newPassword: string) {
  return prisma.user.update({ where: { id }, data: { password: await hashPassword(newPassword) }, select: { id: true } })
}

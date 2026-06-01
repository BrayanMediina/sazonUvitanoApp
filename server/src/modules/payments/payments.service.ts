import { prisma }           from '../../config/database.js'
import { getPagination, paginatedResponse } from '../../utils/pagination.js'
import type { PaymentMethod } from '@prisma/client'

export async function processPayment(data: {
  orderId: string
  method: PaymentMethod
  receivedAmount?: number
  cashierId: string
}) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: data.orderId },
    include: { payment: true }
  })

  if (order.payment) throw Object.assign(new Error('El pedido ya fue pagado'), { status: 409 })

  const change = data.method === 'efectivo' && data.receivedAmount != null
    ? data.receivedAmount - order.total
    : null

  const payment = await prisma.payment.create({
    data: {
      orderId:        data.orderId,
      amount:         order.total,
      method:         data.method,
      receivedAmount: data.receivedAmount,
      change:         change ?? undefined,
      cashierId:      data.cashierId,
    },
    include: { order: true, cashier: { select: { id:true, name:true } } },
  })

  await prisma.order.update({ where: { id: data.orderId }, data: { status: 'pagado' } })

  if (order.tableId) {
    await prisma.table.update({ where: { id: order.tableId }, data: { status: 'disponible', currentOrderId: null } })
  }

  return payment
}

export async function getDailyReport(date?: string) {
  const d = date ? new Date(date) : new Date()
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const end   = new Date(start.getTime() + 86_400_000)
  return prisma.payment.findMany({
    where: { paidAt: { gte: start, lt: end } },
    include: { order: true, cashier: { select: { id:true, name:true } } },
    orderBy: { paidAt: 'desc' },
  })
}

export async function getHistory(params: { from?: string; to?: string; page?: number; limit?: number }) {
  const { page, limit, skip } = getPagination(params)
  const where: Record<string, unknown> = {}
  if (params.from || params.to) {
    where.paidAt = {}
    if (params.from) (where.paidAt as any).gte = new Date(params.from)
    if (params.to)   (where.paidAt as any).lte = new Date(params.to)
  }
  const [data, total] = await prisma.$transaction([
    prisma.payment.findMany({ where, skip, take: limit, orderBy: { paidAt: 'desc' }, include: { order: true } }),
    prisma.payment.count({ where }),
  ])
  return paginatedResponse(data, total, page, limit)
}

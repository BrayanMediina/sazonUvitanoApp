import { prisma } from '../../config/database.js'

function dayRange(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date()
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const end   = new Date(start.getTime() + 86_400_000)
  return { start, end }
}

export async function getDaily(date?: string) {
  const { start, end } = dayRange(date)
  return buildSummary(start, end)
}

export async function getRange(from: string, to: string) {
  const start = new Date(from)
  const end   = new Date(to)
  end.setHours(23, 59, 59, 999)

  const days: unknown[] = []
  const cur = new Date(start)
  while (cur <= end) {
    const dayStart = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate())
    const dayEnd   = new Date(dayStart.getTime() + 86_400_000)
    days.push(await buildSummary(dayStart, dayEnd, cur.toISOString().slice(0, 10)))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

async function buildSummary(start: Date, end: Date, dateLabel?: string) {
  const [payments, orders, deliveries] = await prisma.$transaction([
    prisma.payment.findMany({
      where: { paidAt: { gte: start, lt: end } },
      include: { order: { include: { items: { include: { product: true } } } } },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: start, lt: end } },
    }),
    prisma.delivery.findMany({
      where: { createdAt: { gte: start, lt: end } },
    }),
  ])

  const totalRevenue     = payments.reduce((s, p) => s + p.amount, 0)
  const totalOrders      = orders.length
  const totalDeliveries  = deliveries.length
  const averageTicket    = totalRevenue > 0 && payments.length > 0 ? totalRevenue / payments.length : 0

  const paymentBreakdown = Object.fromEntries(
    ['efectivo','tarjeta','transferencia','nequi','daviplata'].map((m) => [
      m,
      payments.filter((p) => p.method === m).reduce((s, p) => s + p.amount, 0),
    ])
  )

  const ordersByStatus = Object.fromEntries(
    ['tomado','en_preparacion','listo','entregado','pagado','finalizado','cancelado'].map((s) => [
      s,
      orders.filter((o) => o.status === s).length,
    ])
  )

  const productQtys: Record<string, { product: unknown; quantity: number }> = {}
  for (const payment of payments) {
    for (const item of payment.order.items) {
      const key = item.productId
      if (!productQtys[key]) productQtys[key] = { product: item.product, quantity: 0 }
      productQtys[key].quantity += item.quantity
    }
  }
  const topProducts = Object.values(productQtys)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  return {
    date:             dateLabel ?? start.toISOString().slice(0, 10),
    totalOrders,
    totalRevenue,
    totalDeliveries,
    averageTicket,
    paymentBreakdown,
    ordersByStatus,
    topProducts,
  }
}

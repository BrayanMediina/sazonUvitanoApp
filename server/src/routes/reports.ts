import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { store } from '../store.js'

const router = Router()

router.get('/reports/summary', authMiddleware, (_req, res) => {
  const totalRevenue = store.payments.reduce((acc, payment) => acc + payment.amount, 0)
  res.json({
    totalOrders: store.orders.length,
    totalDeliveries: store.deliveries.length,
    totalRevenue,
    activeTables: store.tables.filter((table) => table.status === 'Ocupada').length,
    pendingOrders: store.orders.filter((order) => order.status !== 'Pagado' && order.status !== 'Finalizado').length
  })
})

export { router as reportRoutes }

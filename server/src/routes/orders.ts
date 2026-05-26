import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth.js'
import { createOrder, store, updateOrder } from '../store.js'
import { emitSocketEvent } from '../socket.js'

const router = Router()

const orderSchema = z.object({
  tableId: z.string().min(1),
  status: z.enum(['Pedido tomado', 'En preparación', 'Listo', 'Entregado', 'Pagado', 'Finalizado']),
  total: z.number().nonnegative(),
  items: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative()
  }))
})

const patchSchema = z.object({
  status: z.enum(['Pedido tomado', 'En preparación', 'Listo', 'Entregado', 'Pagado', 'Finalizado'])
})

router.get('/orders', authMiddleware, (_req, res) => {
  res.json(store.orders)
})

router.post('/orders', authMiddleware, (req, res) => {
  const parsed = orderSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const order = {
    id: `order-${store.orders.length + 1}`,
    tableId: parsed.data.tableId,
    status: parsed.data.status,
    total: parsed.data.total,
    createdAt: new Date().toISOString(),
    items: parsed.data.items.map((item) => ({ productId: `product-${Math.random()}`, name: item.name, quantity: item.quantity, price: item.price }))
  }

  createOrder(order)
  emitSocketEvent('order-created', order)
  res.status(201).json(order)
})

router.patch('/orders/:id', authMiddleware, (req, res) => {
  const parsed = patchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  if (!orderId) {
    res.status(400).json({ error: 'Order id is required' })
    return
  }

  updateOrder(orderId, { status: parsed.data.status })
  emitSocketEvent('order-updated', { id: orderId, status: parsed.data.status })
  res.json({ ok: true })
})

export { router as orderRoutes }

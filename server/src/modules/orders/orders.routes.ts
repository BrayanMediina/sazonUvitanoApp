import { Router }      from 'express'
import { z }           from 'zod'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'
import { validate }    from '../../middlewares/validate.middleware.js'
import * as svc        from './orders.service.js'
import { emitToAll, emitToRoles } from '../../sockets/socket.server.js'
import { pushToRoles }            from '../../services/push.service.js'
import type { AuthRequest } from '../../middlewares/auth.middleware.js'

const router = Router()

const createSchema = z.object({
  type:    z.enum(['mesa','domicilio']),
  tableId: z.string().uuid().optional(),
  items:   z.array(z.object({
    productId: z.string(),
    quantity:  z.number().int().positive(),
    notes:     z.string().optional(),
  })).min(1),
  notes: z.string().optional(),
})

router.get('/', requireAuth, requireRole('administrador','cajero'), async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.getAll(req.query as any) })
  } catch (e) { next(e) }
})

router.get('/:id', requireAuth, requireRole('administrador','cajero','mesero'), async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.getById(req.params['id'] as string) })
  } catch (e) { next(e) }
})

router.post('/', requireAuth, requireRole('administrador','mesero'), validate(createSchema), async (req: AuthRequest, res, next) => {
  try {
    const order = await svc.create({ ...req.body, createdBy: req.user!.id })
    emitToRoles(['cajero','administrador'], 'order:created', { order })
    emitToAll('table:updated', { table: order.table })
    pushToRoles(['cajero','administrador'], {
      title: '🍽️ Nuevo pedido',
      body:  `${order.table ? `Mesa ${order.table.number}` : 'Domicilio'} · $${order.total.toLocaleString('es-CO')}`,
      url:   `/pedidos/${order.id}`,
    })
    res.status(201).json({ success: true, data: order })
  } catch (e) { next(e) }
})

router.patch('/:id/status', requireAuth, requireRole('administrador','cajero'), validate(z.object({
  status: z.enum(['tomado','en_preparacion','listo','entregado','pagado','finalizado','cancelado']),
})), async (req, res, next) => {
  try {
    const order = await svc.updateStatus(req.params['id'] as string, req.body.status)
    emitToAll('order:updated', { order })
    emitToAll('order:status', { orderId: order.id, status: order.status })
    if (order.table) emitToAll('table:updated', { table: order.table })
    // Notificar al mesero cuando el pedido está listo para servir
    if (order.status === 'listo') {
      pushToRoles(['mesero','administrador'], {
        title: '✅ Pedido listo',
        body:  `${order.table ? `Mesa ${order.table.number}` : 'Domicilio'} — listo para entregar`,
        url:   `/pedidos/${order.id}`,
      })
    }
    res.json({ success: true, data: order })
  } catch (e) { next(e) }
})

router.post('/:id/items', requireAuth, requireRole('administrador','cajero','mesero'), validate(z.object({
  productId: z.string(),
  quantity:  z.number().int().positive(),
  notes:     z.string().optional(),
})), async (req, res, next) => {
  try {
    const item = await svc.addItem(req.params['id'] as string, req.body)
    const order = await svc.getById(req.params['id'] as string)
    emitToAll('order:updated', { order })
    res.status(201).json({ success: true, data: item })
  } catch (e) { next(e) }
})

router.delete('/:id/items/:itemId', requireAuth, requireRole('administrador','cajero','mesero'), async (req, res, next) => {
  try {
    const order = await svc.removeItem(req.params['id'] as string, req.params['itemId'] as string)
    emitToAll('order:updated', { order })
    res.json({ success: true, data: order })
  } catch (e) { next(e) }
})

router.patch('/:id/cancel', requireAuth, requireRole('administrador','cajero'), async (req, res, next) => {
  try {
    const order = await svc.cancel(req.params['id'] as string)
    emitToAll('order:updated', { order })
    res.json({ success: true, data: order })
  } catch (e) { next(e) }
})

export default router

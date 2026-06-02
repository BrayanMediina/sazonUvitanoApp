import { Router }      from 'express'
import { z }           from 'zod'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'
import { validate }    from '../../middlewares/validate.middleware.js'
import * as svc        from './deliveries.service.js'
import { emitToRoles, emitToUser } from '../../sockets/socket.server.js'
import { pushToUser, pushToRoles } from '../../services/push.service.js'
import type { AuthRequest }        from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', requireAuth, requireRole('administrador','cajero'), async (req, res, next) => {
  try { res.json({ success: true, data: await svc.getAll(req.query as any) }) } catch (e) { next(e) }
})

// Domiciliarios activos disponibles para asignar (accesible por cajero y admin)
router.get('/available-drivers', requireAuth, requireRole('administrador','cajero'), async (_req, res, next) => {
  try { res.json({ success: true, data: await svc.getAvailableDrivers() }) } catch (e) { next(e) }
})

router.get('/my', requireAuth, requireRole('domiciliario'), async (req: AuthRequest, res, next) => {
  try { res.json({ success: true, data: await svc.getMyDeliveries(req.user!.id) }) } catch (e) { next(e) }
})

router.get('/:id', requireAuth, requireRole('administrador','cajero','domiciliario'), async (req, res, next) => {
  try { res.json({ success: true, data: await svc.getById(req.params['id'] as string) }) } catch (e) { next(e) }
})

router.post('/', requireAuth, requireRole('administrador','cajero'), validate(z.object({
  customerName:  z.string().min(2),
  customerPhone: z.string().min(7),
  street:        z.string().min(5),
  neighborhood:  z.string().optional(),
  reference:     z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity:  z.number().int().positive(),
    notes:     z.string().optional(),
  })).min(1),
})), async (req: AuthRequest, res, next) => {
  try {
    const delivery = await svc.create({ ...req.body, createdBy: req.user!.id })
    emitToRoles(['cajero','administrador'], 'delivery:created', { delivery })
    pushToRoles(['cajero','administrador'], {
      title: '🛵 Nuevo domicilio',
      body:  `Para ${delivery.customerName}`,
      url:   '/domicilios',
    })
    res.status(201).json({ success: true, data: delivery })
  } catch (e) { next(e) }
})

router.patch('/:id/assign', requireAuth, requireRole('administrador','cajero'), validate(z.object({
  driverId: z.string(),
})), async (req, res, next) => {
  try {
    const delivery = await svc.assign(req.params['id'] as string, req.body.driverId)
    emitToUser(req.body.driverId, 'delivery:created', { delivery })
    emitToRoles(['cajero','administrador'], 'delivery:updated', { delivery })
    // Notificar al domiciliario asignado
    pushToUser(req.body.driverId, {
      title: '🛵 Nueva entrega asignada',
      body:  `Para ${delivery.customerName} — ${delivery.street}`,
      url:   '/mis-entregas',
    })
    res.json({ success: true, data: delivery })
  } catch (e) { next(e) }
})

router.patch('/:id/status', requireAuth, requireRole('administrador','cajero','domiciliario'), validate(z.object({
  status: z.enum(['pendiente','asignado','en_camino','entregado','cancelado']),
})), async (req, res, next) => {
  try {
    const delivery = await svc.updateStatus(req.params['id'] as string, req.body.status)
    emitToRoles(['cajero','administrador'], 'delivery:updated', { delivery })
    res.json({ success: true, data: delivery })
  } catch (e) { next(e) }
})

router.patch('/location', requireAuth, requireRole('domiciliario'), validate(z.object({
  lat: z.number(),
  lng: z.number(),
})), async (req: AuthRequest, res, next) => {
  try {
    await svc.updateLocation(req.user!.id, req.body.lat, req.body.lng)
    res.json({ success: true })
  } catch (e) { next(e) }
})

export default router

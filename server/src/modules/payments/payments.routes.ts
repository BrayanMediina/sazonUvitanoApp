import { Router }       from 'express'
import { z }            from 'zod'
import { requireAuth }  from '../../middlewares/auth.middleware.js'
import { requireRole }  from '../../middlewares/role.middleware.js'
import { validate }     from '../../middlewares/validate.middleware.js'
import * as svc         from './payments.service.js'
import { emitToRoles }  from '../../sockets/socket.server.js'
import type { AuthRequest } from '../../middlewares/auth.middleware.js'

const router = Router()

router.post('/', requireAuth, requireRole('administrador','cajero'), validate(z.object({
  orderId:        z.string(),
  method:         z.enum(['efectivo','tarjeta','transferencia','nequi','daviplata']),
  receivedAmount: z.coerce.number().optional(),
})), async (req: AuthRequest, res, next) => {
  try {
    const payment = await svc.processPayment({ ...req.body, cashierId: req.user!.id })
    emitToRoles(['administrador'], 'payment:completed', { payment })
    res.status(201).json({ success: true, data: payment })
  } catch (e) { next(e) }
})

router.get('/', requireAuth, requireRole('administrador'), async (req, res, next) => {
  try { res.json({ success: true, ...(await svc.getHistory(req.query as any)) }) } catch (e) { next(e) }
})

router.get('/report/daily', requireAuth, requireRole('administrador','cajero'), async (req, res, next) => {
  try {
    const data = await svc.getDailyReport(req.query.date as string)
    res.json({ success: true, data })
  } catch (e) { next(e) }
})

export default router

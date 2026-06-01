import { Router }      from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRole } from '../../middlewares/role.middleware.js'
import * as svc        from './reports.service.js'

const router = Router()

router.get('/daily', requireAuth, requireRole('administrador'), async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.getDaily(req.query.date as string) })
  } catch (e) { next(e) }
})

router.get('/range', requireAuth, requireRole('administrador'), async (req, res, next) => {
  try {
    const { from, to } = req.query as { from: string; to: string }
    if (!from || !to) { res.status(400).json({ success: false, message: 'Parámetros from y to requeridos' }); return }
    res.json({ success: true, data: await svc.getRange(from, to) })
  } catch (e) { next(e) }
})

export default router

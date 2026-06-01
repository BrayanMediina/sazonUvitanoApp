import { Router }       from 'express'
import { z }            from 'zod'
import { requireAuth }  from '../../middlewares/auth.middleware.js'
import { requireRole }  from '../../middlewares/role.middleware.js'
import { validate }     from '../../middlewares/validate.middleware.js'
import * as svc         from './users.service.js'

const router = Router()
const admin  = [requireAuth, requireRole('administrador')]

const createSchema = z.object({
  name:     z.string().min(3),
  document: z.string().min(5),
  email:    z.string().email().optional(),
  phone:    z.string().optional(),
  password: z.string().min(6),
  role:     z.enum(['mesero','cajero','domiciliario','administrador']),
})

const updateSchema = z.object({
  name:     z.string().min(3).optional(),
  email:    z.string().email().optional(),
  phone:    z.string().optional(),
  role:     z.enum(['mesero','cajero','domiciliario','administrador']).optional(),
  isActive: z.boolean().optional(),
})

router.get('/', ...admin, async (req, res, next) => {
  try {
    const data = await svc.getAll(req.query as any)
    res.json({ success: true, data })
  } catch (e) { next(e) }
})

router.get('/:id', ...admin, async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.getById(req.params['id'] as string) })
  } catch (e) { next(e) }
})

router.post('/', ...admin, validate(createSchema), async (req, res, next) => {
  try {
    res.status(201).json({ success: true, data: await svc.create(req.body) })
  } catch (e) { next(e) }
})

router.patch('/:id', ...admin, validate(updateSchema), async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.update(req.params['id'] as string, req.body) })
  } catch (e) { next(e) }
})

router.patch('/:id/toggle-active', ...admin, async (req, res, next) => {
  try {
    res.json({ success: true, data: await svc.toggleActive(req.params['id'] as string) })
  } catch (e) { next(e) }
})

router.patch('/:id/reset-password', ...admin, async (req, res, next) => {
  try {
    const { newPassword } = z.object({ newPassword: z.string().min(6) }).parse(req.body)
    await svc.resetPassword(req.params['id'] as string, newPassword)
    res.json({ success: true, message: 'Contraseña restablecida' })
  } catch (e) { next(e) }
})

export default router

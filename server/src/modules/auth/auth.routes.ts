import { Router } from 'express'
import { validate }   from '../../middlewares/validate.middleware.js'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { loginSchema, registerSchema, refreshSchema } from './auth.schemas.js'
import * as svc from './auth.service.js'
import type { AuthRequest } from '../../middlewares/auth.middleware.js'

const router = Router()

function safeUser(u: Record<string, unknown>) {
  const { password: _, ...rest } = u
  return rest
}

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { user, tokens } = await svc.login(req.body.document, req.body.password)
    res.json({ success: true, data: { user: safeUser(user as any), ...tokens } })
  } catch (e) { next(e) }
})

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { user, tokens } = await svc.register(req.body)
    res.status(201).json({ success: true, data: { user: safeUser(user as any), ...tokens } })
  } catch (e) { next(e) }
})

router.post('/refresh', validate(refreshSchema), async (req, res, next) => {
  try {
    const tokens = await svc.refresh(req.body.refreshToken)
    res.json({ success: true, data: tokens })
  } catch (e) { next(e) }
})

router.post('/logout', requireAuth, (_req, res) => {
  res.json({ success: true, message: 'Sesión cerrada' })
})

router.get('/me', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const user = await svc.me(req.user!.id)
    res.json({ success: true, data: user })
  } catch (e) { next(e) }
})

export default router

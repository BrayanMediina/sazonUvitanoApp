import { Router } from 'express'
import { z }      from 'zod'
import { requireAuth }    from '../../middlewares/auth.middleware.js'
import { validate }       from '../../middlewares/validate.middleware.js'
import { prisma }         from '../../config/database.js'
import { env }            from '../../config/env.js'
import type { AuthRequest } from '../../middlewares/auth.middleware.js'

const router = Router()

// Devuelve la clave pública VAPID para que el frontend la use al suscribirse
router.get('/vapid-public-key', (_req, res) => {
  res.json({ success: true, data: { publicKey: env.VAPID_PUBLIC_KEY ?? null } })
})

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth:   z.string().min(1),
  }),
})

// Guardar suscripción del dispositivo
router.post('/subscribe', requireAuth, validate(subscribeSchema), async (req: AuthRequest, res, next) => {
  try {
    const { endpoint, keys } = req.body as { endpoint: string; keys: { p256dh: string; auth: string } }
    await prisma.pushSubscription.upsert({
      where:  { endpoint },
      update: { p256dh: keys.p256dh, auth: keys.auth, userId: req.user!.id },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: req.user!.id },
    })
    res.json({ success: true })
  } catch (e) { next(e) }
})

// Eliminar suscripción (logout / desactivar notificaciones)
router.delete('/unsubscribe', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { endpoint } = req.body as { endpoint?: string }
    if (endpoint) {
      await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: req.user!.id } })
    } else {
      await prisma.pushSubscription.deleteMany({ where: { userId: req.user!.id } })
    }
    res.json({ success: true })
  } catch (e) { next(e) }
})

export default router

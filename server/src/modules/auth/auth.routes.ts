import { Router } from 'express'
import { validate }    from '../../middlewares/validate.middleware.js'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { loginSchema, registerSchema, refreshSchema } from './auth.schemas.js'
import * as svc    from './auth.service.js'
import * as webauthn from './webauthn.service.js'
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
    const { user } = await svc.register(req.body)
    res.status(201).json({ success: true, data: { user: safeUser(user as any), pendingActivation: true } })
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

// ── WebAuthn / Reconocimiento facial ───────────────────────────

// 1. Obtener opciones para registrar credencial biométrica (requiere sesión activa)
router.post('/webauthn/register-options', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const options = await webauthn.getRegistrationOptions(req.user!.id)
    res.json({ success: true, data: options })
  } catch (e) { next(e) }
})

// 2. Verificar y guardar credencial biométrica
router.post('/webauthn/register-verify', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const result = await webauthn.verifyRegistration(req.user!.id, req.body)
    res.json({ success: true, data: result })
  } catch (e) { next(e) }
})

// 3. Obtener desafío para login con biometría (pública — solo requiere documento)
router.post('/webauthn/login-options', async (req, res, next) => {
  try {
    const { document } = req.body as { document: string }
    if (!document) { res.status(400).json({ success: false, message: 'Documento requerido' }); return }
    const { options, userId } = await webauthn.getAuthenticationOptions(document)
    res.json({ success: true, data: { options, userId } })
  } catch (e) { next(e) }
})

// 4. Verificar respuesta biométrica → devuelve tokens JWT
router.post('/webauthn/login-verify', async (req, res, next) => {
  try {
    const { userId, response } = req.body as { userId: string; response: unknown }
    if (!userId || !response) { res.status(400).json({ success: false, message: 'Datos incompletos' }); return }
    const { user, tokens } = await webauthn.verifyAuthentication(userId, response as any)
    res.json({ success: true, data: { user: safeUser(user as any), ...tokens } })
  } catch (e) { next(e) }
})

// 5. Verificar si el usuario tiene credencial biométrica registrada
router.get('/webauthn/has-credential', requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const count = await (await import('../../config/database.js')).prisma.webAuthnCredential.count({
      where: { userId: req.user!.id },
    })
    res.json({ success: true, data: { hasCredential: count > 0 } })
  } catch (e) { next(e) }
})

export default router

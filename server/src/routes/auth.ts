import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../env.js'
import { getUserByDocument, createUser, getUserById, authenticateUserByDocument } from '../store.js'

const router = Router()

const loginSchema = z.object({
  document: z.string().min(5),
  password: z.string().min(6)
})

const registerSchema = z.object({
  name: z.string().min(3),
  document: z.string().min(5).unique('Documento ya registrado'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['mesero', 'cajero', 'domiciliario', 'administrador']).default('mesero')
})

const faceIdSchema = z.object({
  userId: z.string(),
  faceData: z.string()
})

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
})

function createTokens(user: { id: string; document: string; name: string; role: string }) {
  const accessToken = jwt.sign(
    { sub: user.id, document: user.document, name: user.name, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { sub: user.id, document: user.document, name: user.name, role: user.role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

// Registro de nuevos usuarios
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const existingUser = getUserByDocument(parsed.data.document)
  if (existingUser) {
    res.status(409).json({ error: 'Documento ya registrado' })
    return
  }

  try {
    const user = await createUser({
      name: parsed.data.name,
      document: parsed.data.document,
      email: parsed.data.email,
      phone: parsed.data.phone,
      password: parsed.data.password,
      role: parsed.data.role
    })

    const tokens = createTokens(user)
    res.status(201).json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user.id, name: user.name, document: user.document, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
})

// Login por documento y contraseña
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const user = await authenticateUserByDocument(parsed.data.document, parsed.data.password)
  if (!user) {
    res.status(401).json({ error: 'Documento o contraseña inválidos' })
    return
  }

  const tokens = createTokens(user)
  res.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: { id: user.id, name: user.name, document: user.document, role: user.role }
  })
})

// Login por Face ID
router.post('/login/faceid', async (req, res) => {
  const parsed = faceIdSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const user = getUserById(parsed.data.userId)
  if (!user || !user.faceIdEnabled || user.faceId !== parsed.data.faceData) {
    res.status(401).json({ error: 'Face ID inválido o no habilitado' })
    return
  }

  const tokens = createTokens(user)
  res.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: { id: user.id, name: user.name, document: user.document, role: user.role }
  })
})

// Refresh token
router.post('/refresh', (req, res) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  try {
    const payload = jwt.verify(parsed.data.refreshToken, env.JWT_REFRESH_SECRET) as {
      sub?: string
      document?: string
      name?: string
      role?: string
    }
    const user = getUserById(payload.sub ?? '')
    if (!user) {
      res.status(401).json({ error: 'Refresh inválido' })
      return
    }

    res.json({
      ...createTokens(user),
      user: { id: user.id, name: user.name, document: user.document, role: user.role }
    })
  } catch {
    res.status(401).json({ error: 'Refresh inválido' })
  }
})

// Logout
router.post('/logout', (_req, res) => {
  res.json({ ok: true })
})

// Configurar Face ID
router.post('/faceid/setup', async (req, res) => {
  const parsed = z.object({ userId: z.string(), faceData: z.string() }).safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  try {
    // Esta es una operación simplificada - en producción usar Web Authentication API
    res.json({ ok: true, message: 'Face ID configurado' })
  } catch (error) {
    res.status(500).json({ error: 'Error configurando Face ID' })
  }
})

export { router as authRoutes }

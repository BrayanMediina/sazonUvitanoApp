import { prisma }        from '../../config/database.js'
import { createTokenPair } from '../../utils/jwt.js'

// Umbral estándar de face-api.js: distancia euclídea < 0.6 → mismo rostro
const THRESHOLD = 0.6

function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, v, i) => sum + (v - (b[i] ?? 0)) ** 2, 0))
}

function validateDescriptor(d: number[]) {
  if (!Array.isArray(d) || d.length !== 128)
    throw Object.assign(new Error('Descriptor facial inválido'), { status: 400 })
}

// ── Registrar descriptor ──────────────────────────────────────
export async function enrollFace(userId: string, descriptor: number[]) {
  validateDescriptor(descriptor)
  await prisma.user.update({
    where: { id: userId },
    data:  { faceDescriptor: JSON.stringify(descriptor) },
  })
  return { enrolled: true }
}

// ── Verificar rostro y devolver JWT ──────────────────────────
export async function verifyFace(document: string, descriptor: number[]) {
  validateDescriptor(descriptor)

  const user = await prisma.user.findUnique({ where: { document } })
  if (!user)
    throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  if (!user.isActive)
    throw Object.assign(new Error('Tu cuenta aún no ha sido activada. Comunícate con el administrador.'), { status: 403 })
  if (!user.faceDescriptor)
    throw Object.assign(new Error('No tienes reconocimiento facial registrado. Ingresa con contraseña primero.'), { status: 404 })

  const stored = JSON.parse(user.faceDescriptor) as number[]
  const dist   = euclidean(descriptor, stored)

  if (dist > THRESHOLD)
    throw Object.assign(new Error('Rostro no reconocido. Inténtalo de nuevo o usa tu contraseña.'), { status: 401 })

  return { user, tokens: createTokenPair(user) }
}

// ── Consultar si el usuario tiene descriptor guardado ─────────
export async function hasFaceDescriptor(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { faceDescriptor: true } })
  return !!user?.faceDescriptor
}

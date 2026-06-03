import { prisma }          from '../../config/database.js'
import { hashPassword, comparePassword } from '../../utils/hash.js'
import { createTokenPair, verifyRefreshToken } from '../../utils/jwt.js'
import type { Role }       from '@prisma/client'

export async function login(document: string, password: string) {
  const user = await prisma.user.findUnique({ where: { document } })
  if (!user) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })
  if (!user.isActive)
    throw Object.assign(
      new Error('Tu cuenta aún no ha sido activada. Comunícate con el administrador.'),
      { status: 403 }
    )

  const valid = await comparePassword(password, user.password)
  if (!valid) throw Object.assign(new Error('Credenciales inválidas'), { status: 401 })

  return { user, tokens: createTokenPair(user) }
}

export async function register(data: {
  name: string; document: string; email?: string; phone?: string; password: string; role: Role
}) {
  if (data.role === 'administrador')
    throw Object.assign(new Error('No se puede registrar un administrador'), { status: 403 })

  const exists = await prisma.user.findUnique({ where: { document: data.document } })
  if (exists) throw Object.assign(new Error('Documento ya registrado'), { status: 409 })

  // Registros públicos nacen inactivos — un admin debe activarlos
  const user = await prisma.user.create({
    data: { ...data, password: await hashPassword(data.password), isActive: false },
  })

  return { user }
}

export async function refresh(token: string) {
  const payload = verifyRefreshToken(token)
  const user    = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || !user.isActive) throw Object.assign(new Error('Token inválido'), { status: 401 })
  return createTokenPair(user)
}

export async function me(id: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id } })
  const { password: _, ...safe } = user
  return safe
}

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server'
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/server'
import { prisma }            from '../../config/database.js'
import { createTokenPair }   from '../../utils/jwt.js'
import { env }               from '../../config/env.js'

// ── RP config ─────────────────────────────────────────────────
function getRpConfig() {
  const origin = env.FRONTEND_URL
  const url    = new URL(origin)
  return {
    rpName:   'El Sazón Uvitano',
    rpID:     url.hostname,          // e.g. sazon-uvitano-app-ten.vercel.app
    origin,
  }
}

// Desafíos en memoria (per-process, expiran en 5 min)
const challenges = new Map<string, { challenge: string; expiresAt: number }>()

function storeChallenge(userId: string, challenge: string) {
  challenges.set(userId, { challenge, expiresAt: Date.now() + 5 * 60_000 })
}

function popChallenge(userId: string): string | null {
  const entry = challenges.get(userId)
  challenges.delete(userId)
  if (!entry || Date.now() > entry.expiresAt) return null
  return entry.challenge
}

// ── Registro ───────────────────────────────────────────────────
export async function getRegistrationOptions(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
  const existing = await prisma.webAuthnCredential.findMany({ where: { userId } })
  const { rpName, rpID } = getRpConfig()

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID:                  Buffer.from(userId),
    userName:                user.document,
    userDisplayName:         user.name,
    excludeCredentials:      existing.map((c) => ({
      id:         c.credentialId,
      transports: c.transports ? (c.transports.split(',') as any) : undefined,
    })),
    authenticatorSelection: {
      // Platform authenticator = dispositivo integrado (Face ID / huella)
      authenticatorAttachment: 'platform',
      residentKey:             'preferred',
      userVerification:        'required',
    },
  })

  storeChallenge(userId, options.challenge)
  return options
}

export async function verifyRegistration(
  userId:   string,
  response: RegistrationResponseJSON,
) {
  const { origin, rpID } = getRpConfig()
  const expectedChallenge = popChallenge(userId)
  if (!expectedChallenge) throw Object.assign(new Error('Desafío expirado. Inténtalo de nuevo.'), { status: 400 })

  const { verified, registrationInfo } = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin:    origin,
    expectedRPID:      rpID,
    requireUserVerification: true,
  })

  if (!verified || !registrationInfo)
    throw Object.assign(new Error('Verificación fallida'), { status: 400 })

  const { credential } = registrationInfo

  await prisma.webAuthnCredential.upsert({
    where:  { credentialId: credential.id },
    update: { counter: BigInt(credential.counter), publicKey: Buffer.from(credential.publicKey).toString('base64') },
    create: {
      userId,
      credentialId: credential.id,
      publicKey:    Buffer.from(credential.publicKey).toString('base64'),
      counter:      BigInt(credential.counter),
      deviceType:   registrationInfo.credentialDeviceType ?? null,
      transports:   response.response.transports?.join(',') ?? null,
    },
  })

  return { verified: true }
}

// ── Autenticación ──────────────────────────────────────────────
export async function getAuthenticationOptions(document: string) {
  const user = await prisma.user.findUnique({ where: { document } })
  if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 })
  if (!user.isActive) throw Object.assign(new Error('Tu cuenta aún no ha sido activada. Comunícate con el administrador.'), { status: 403 })

  const credentials = await prisma.webAuthnCredential.findMany({ where: { userId: user.id } })
  if (!credentials.length)
    throw Object.assign(new Error('No tienes reconocimiento facial registrado. Ingresa con contraseña primero.'), { status: 404 })

  const { rpID } = getRpConfig()
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: credentials.map((c) => ({
      id:         c.credentialId,
      transports: c.transports ? (c.transports.split(',') as any) : undefined,
    })),
  })

  storeChallenge(user.id, options.challenge)
  return { options, userId: user.id }
}

export async function verifyAuthentication(
  userId:   string,
  response: AuthenticationResponseJSON,
) {
  const { origin, rpID } = getRpConfig()
  const expectedChallenge = popChallenge(userId)
  if (!expectedChallenge) throw Object.assign(new Error('Desafío expirado. Inténtalo de nuevo.'), { status: 400 })

  const credential = await prisma.webAuthnCredential.findUnique({
    where: { credentialId: response.id },
  })
  if (!credential) throw Object.assign(new Error('Credencial no encontrada'), { status: 404 })

  const { verified, authenticationInfo } = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin:  origin,
    expectedRPID:    rpID,
    requireUserVerification: true,
    credential: {
      id:         credential.credentialId,
      publicKey:  Buffer.from(credential.publicKey, 'base64'),
      counter:    Number(credential.counter),
      transports: credential.transports ? (credential.transports.split(',') as any) : undefined,
    },
  })

  if (!verified) throw Object.assign(new Error('Verificación fallida'), { status: 401 })

  // Actualizar contador (replay-attack protection)
  await prisma.webAuthnCredential.update({
    where: { credentialId: response.id },
    data:  { counter: BigInt(authenticationInfo.newCounter) },
  })

  const user = await prisma.user.findUniqueOrThrow({ where: { id: credential.userId } })
  return { user, tokens: createTokenPair(user) }
}

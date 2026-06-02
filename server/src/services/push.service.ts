import webpush from 'web-push'
import { prisma } from '../config/database.js'
import { env }    from '../config/env.js'

// Inicializar solo si las claves están configuradas
if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY)
}

export interface PushPayload {
  title: string
  body:  string
  url?:  string
}

async function sendToSubscription(
  sub: { id: string; endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
) {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ ...payload, icon: '/icons/icon-192.svg', badge: '/icons/icon-192.svg' }),
    )
  } catch (err: unknown) {
    const status = (err as { statusCode?: number }).statusCode
    // 410 Gone / 404 → suscripción expirada, eliminar
    if (status === 410 || status === 404) {
      await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
    }
  }
}

export async function pushToUser(userId: string, payload: PushPayload) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return
  const subs = await prisma.pushSubscription.findMany({ where: { userId } })
  await Promise.allSettled(subs.map((s) => sendToSubscription(s, payload)))
}

export async function pushToRoles(roles: string[], payload: PushPayload) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return
  const users = await prisma.user.findMany({
    where: { role: { in: roles as any }, isActive: true },
    select: { id: true },
  })
  await Promise.allSettled(users.map((u) => pushToUser(u.id, payload)))
}

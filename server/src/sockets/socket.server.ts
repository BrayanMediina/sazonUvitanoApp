import type { Server as HttpServer } from 'node:http'
import { Server, type Socket }       from 'socket.io'
import { verifyAccessToken }         from '../utils/jwt.js'
import { prisma }                    from '../config/database.js'
import { env }                       from '../config/env.js'

let io: Server | undefined

export function createSocketServer(server: HttpServer) {
  // CORS: auth por Bearer token (no cookies), podemos abrir a cualquier origen.
  // env.CORS_ORIGIN puede ser un string con comas o '*' — normalizamos a array.
  const corsOrigin: string | string[] =
    env.CORS_ORIGIN === '*'
      ? '*'
      : env.CORS_ORIGIN.includes(',')
        ? env.CORS_ORIGIN.split(',').map((s) => s.trim())
        : env.CORS_ORIGIN

  io = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
    // polling primero: más compatible con proxies/firewalls; luego upgrade a WS
    transports: ['polling', 'websocket'],
    // Render free puede tardar en despertar — ser paciente con pings
    pingTimeout:  60_000,
    pingInterval: 25_000,
  })

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string
    if (!token) { next(new Error('Token requerido')); return }
    try {
      const payload = verifyAccessToken(token)
      ;(socket as any).user = payload
      next()
    } catch {
      next(new Error('Token inválido'))
    }
  })

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as { sub: string; role: string; name: string }

    // Unirse a salas por rol y por usuario
    socket.join(`role:${user.role}`)
    socket.join(`user:${user.sub}`)

    // GPS: domiciliario emite ubicación
    socket.on('driver:location', async (data: { lat: number; lng: number; timestamp: number }) => {
      const update = { driverId: user.sub, ...data }
      io?.to('role:cajero').to('role:administrador').to(`user:${user.sub}`).emit('delivery:location', update)

      // Persistir en DB
      try {
        await prisma.delivery.updateMany({
          where: { driverId: user.sub, status: 'en_camino' },
          data:  { currentLat: data.lat, currentLng: data.lng },
        })
      } catch { /* silencioso */ }
    })

    // Chat
    socket.on('chat:send', async (data: { content: string }) => {
      if (!data.content?.trim()) return
      const message = await prisma.chatMessage.create({
        data: {
          senderId:   user.sub,
          senderName: user.name,
          senderRole: user.role as any,
          content:    data.content.trim(),
        },
      })
      io?.emit('chat:message', {
        message: {
          id:         message.id,
          senderId:   message.senderId,
          senderName: message.senderName,
          senderRole: message.senderRole,
          content:    message.content,
          timestamp:  message.createdAt.toISOString(),
          read:       false,
        },
      })
    })

    socket.on('disconnect', () => { /* cleanup automático */ })
  })

  return io
}

export function emitToAll(event: string, payload: unknown) {
  io?.emit(event, payload)
}

export function emitToRoles(roles: string[], event: string, payload: unknown) {
  for (const role of roles) io?.to(`role:${role}`).emit(event, payload)
}

export function emitToUser(userId: string, event: string, payload: unknown) {
  io?.to(`user:${userId}`).emit(event, payload)
}

export function getIO() { return io }

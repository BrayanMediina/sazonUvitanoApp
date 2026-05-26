import type { Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import { logger } from './logger.js'

let io: Server | undefined

export function createSocketServer(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  io.on('connection', (socket) => {
    logger.info(`Socket conectado: ${socket.id}`)

    socket.on('new-message', (message) => {
      io?.emit('new-message', message)
    })

    socket.on('delivery-location', (location) => {
      io?.emit('delivery-location', location)
    })

    socket.on('disconnect', () => {
      logger.info(`Socket desconectado: ${socket.id}`)
    })
  })

  return io
}

export function emitSocketEvent(event: string, payload: unknown) {
  io?.emit(event, payload)
}

export function getSocketServer() {
  if (!io) {
    throw new Error('Socket server no inicializado')
  }

  return io
}

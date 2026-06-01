import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
let io;
export function createSocketServer(server) {
    io = new Server(server, {
        cors: { origin: env.CORS_ORIGIN, credentials: true },
        transports: ['websocket', 'polling'],
    });
    // Auth middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            next(new Error('Token requerido'));
            return;
        }
        try {
            const payload = verifyAccessToken(token);
            socket.user = payload;
            next();
        }
        catch {
            next(new Error('Token inválido'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.user;
        // Unirse a salas por rol y por usuario
        socket.join(`role:${user.role}`);
        socket.join(`user:${user.sub}`);
        // GPS: domiciliario emite ubicación
        socket.on('driver:location', async (data) => {
            const update = { driverId: user.sub, ...data };
            io?.to('role:cajero').to('role:administrador').to(`user:${user.sub}`).emit('delivery:location', update);
            // Persistir en DB
            try {
                await prisma.delivery.updateMany({
                    where: { driverId: user.sub, status: 'en_camino' },
                    data: { currentLat: data.lat, currentLng: data.lng },
                });
            }
            catch { /* silencioso */ }
        });
        // Chat
        socket.on('chat:send', async (data) => {
            if (!data.content?.trim())
                return;
            const message = await prisma.chatMessage.create({
                data: {
                    senderId: user.sub,
                    senderName: user.name,
                    senderRole: user.role,
                    content: data.content.trim(),
                },
            });
            io?.emit('chat:message', {
                message: {
                    id: message.id,
                    senderId: message.senderId,
                    senderName: message.senderName,
                    senderRole: message.senderRole,
                    content: message.content,
                    timestamp: message.createdAt.toISOString(),
                    read: false,
                },
            });
        });
        socket.on('disconnect', () => { });
    });
    return io;
}
export function emitToAll(event, payload) {
    io?.emit(event, payload);
}
export function emitToRoles(roles, event, payload) {
    for (const role of roles)
        io?.to(`role:${role}`).emit(event, payload);
}
export function emitToUser(userId, event, payload) {
    io?.to(`user:${userId}`).emit(event, payload);
}
export function getIO() { return io; }

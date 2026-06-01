import http from 'node:http';
import 'dotenv/config';
import { app } from './app.js';
import { createSocketServer } from './sockets/socket.server.js';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
const server = http.createServer(app);
createSocketServer(server);
async function main() {
    await prisma.$connect();
    server.listen(env.PORT, () => {
        console.log(`[server] Escuchando en puerto ${env.PORT} (${env.NODE_ENV})`);
    });
}
main().catch((err) => {
    console.error('[server] Error fatal:', err);
    process.exit(1);
});

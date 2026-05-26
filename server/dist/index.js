import http from 'node:http';
import { app } from './app.js';
import { createSocketServer } from './socket.js';
import { env } from './env.js';
import { logger } from './logger.js';
const server = http.createServer(app);
createSocketServer(server);
server.listen(env.PORT, () => {
    logger.info(`Backend escuchando en puerto ${env.PORT}`);
});

import jwt from 'jsonwebtoken';
import { env } from '../env.js';
export function authMiddleware(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }
    const token = authorization.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = {
            id: payload.sub ?? '',
            email: payload.email ?? '',
            role: payload.role ?? 'mesero'
        };
        next();
    }
    catch {
        res.status(401).json({ error: 'Token inválido' });
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        if (req.user?.role !== role && req.user?.role !== 'admin') {
            res.status(403).json({ error: 'Permiso denegado' });
            return;
        }
        next();
    };
}

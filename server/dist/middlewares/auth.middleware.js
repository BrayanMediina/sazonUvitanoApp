import { verifyAccessToken } from '../utils/jwt.js';
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Token requerido' });
        return;
    }
    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = { id: payload.sub, name: payload.name, document: payload.document, role: payload.role };
        next();
    }
    catch {
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
}

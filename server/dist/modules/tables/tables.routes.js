import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as svc from './tables.service.js';
import { emitToAll } from '../../sockets/socket.server.js';
const router = Router();
const auth = requireAuth;
const admin = [requireAuth, requireRole('administrador')];
const staff = [requireAuth, requireRole('administrador', 'cajero', 'mesero')];
router.get('/', ...staff, async (_req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getAll() });
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id', ...staff, async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getById(req.params['id']) });
    }
    catch (e) {
        next(e);
    }
});
router.post('/', ...admin, validate(z.object({
    number: z.coerce.number().int().positive(),
    capacity: z.coerce.number().int().positive().optional(),
    zone: z.string().optional(),
})), async (req, res, next) => {
    try {
        const table = await svc.create(req.body);
        emitToAll('table:updated', { table });
        res.status(201).json({ success: true, data: table });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id', ...admin, async (req, res, next) => {
    try {
        const table = await svc.update(req.params['id'], req.body);
        emitToAll('table:updated', { table });
        res.json({ success: true, data: table });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id/status', auth, requireRole('administrador', 'cajero', 'mesero'), validate(z.object({
    status: z.enum(['disponible', 'ocupada', 'pendiente_pago']),
})), async (req, res, next) => {
    try {
        const table = await svc.updateStatus(req.params['id'], req.body.status);
        emitToAll('table:updated', { table });
        res.json({ success: true, data: table });
    }
    catch (e) {
        next(e);
    }
});
router.delete('/:id', ...admin, async (req, res, next) => {
    try {
        await svc.remove(req.params['id']);
        res.json({ success: true, message: 'Mesa eliminada' });
    }
    catch (e) {
        next(e);
    }
});
export default router;

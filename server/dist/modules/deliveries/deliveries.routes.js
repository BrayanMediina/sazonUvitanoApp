import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as svc from './deliveries.service.js';
import { emitToRoles, emitToUser } from '../../sockets/socket.server.js';
const router = Router();
router.get('/', requireAuth, requireRole('administrador', 'cajero'), async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getAll(req.query) });
    }
    catch (e) {
        next(e);
    }
});
router.get('/my', requireAuth, requireRole('domiciliario'), async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getMyDeliveries(req.user.id) });
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id', requireAuth, requireRole('administrador', 'cajero', 'domiciliario'), async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getById(req.params['id']) });
    }
    catch (e) {
        next(e);
    }
});
router.post('/', requireAuth, requireRole('administrador', 'cajero'), validate(z.object({
    customerName: z.string().min(2),
    customerPhone: z.string().min(7),
    street: z.string().min(5),
    neighborhood: z.string().optional(),
    reference: z.string().optional(),
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
        notes: z.string().optional(),
    })).min(1),
})), async (req, res, next) => {
    try {
        const delivery = await svc.create({ ...req.body, createdBy: req.user.id });
        emitToRoles(['cajero', 'administrador'], 'delivery:created', { delivery });
        res.status(201).json({ success: true, data: delivery });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id/assign', requireAuth, requireRole('administrador', 'cajero'), validate(z.object({
    driverId: z.string(),
})), async (req, res, next) => {
    try {
        const delivery = await svc.assign(req.params['id'], req.body.driverId);
        emitToUser(req.body.driverId, 'delivery:created', { delivery });
        emitToRoles(['cajero', 'administrador'], 'delivery:updated', { delivery });
        res.json({ success: true, data: delivery });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id/status', requireAuth, requireRole('administrador', 'cajero', 'domiciliario'), validate(z.object({
    status: z.enum(['pendiente', 'asignado', 'en_camino', 'entregado', 'cancelado']),
})), async (req, res, next) => {
    try {
        const delivery = await svc.updateStatus(req.params['id'], req.body.status);
        emitToRoles(['cajero', 'administrador'], 'delivery:updated', { delivery });
        res.json({ success: true, data: delivery });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/location', requireAuth, requireRole('domiciliario'), validate(z.object({
    lat: z.number(),
    lng: z.number(),
})), async (req, res, next) => {
    try {
        await svc.updateLocation(req.user.id, req.body.lat, req.body.lng);
        res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
});
export default router;

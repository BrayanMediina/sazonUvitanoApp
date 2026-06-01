import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import * as svc from './products.service.js';
const router = Router();
const admin = [requireAuth, requireRole('administrador')];
const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.coerce.number().positive(),
    category: z.enum(['entrada', 'plato_principal', 'bebida', 'postre', 'especial', 'domicilio']),
    imageUrl: z.string().url().optional(),
    isAvailable: z.boolean().default(true),
});
router.get('/', requireAuth, async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getAll(req.query) });
    }
    catch (e) {
        next(e);
    }
});
router.get('/:id', requireAuth, async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.getById(req.params['id']) });
    }
    catch (e) {
        next(e);
    }
});
router.post('/', ...admin, validate(productSchema), async (req, res, next) => {
    try {
        res.status(201).json({ success: true, data: await svc.create(req.body) });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id', ...admin, async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.update(req.params['id'], req.body) });
    }
    catch (e) {
        next(e);
    }
});
router.patch('/:id/toggle-availability', ...admin, async (req, res, next) => {
    try {
        res.json({ success: true, data: await svc.toggleAvailability(req.params['id']) });
    }
    catch (e) {
        next(e);
    }
});
router.delete('/:id', ...admin, async (req, res, next) => {
    try {
        await svc.remove(req.params['id']);
        res.json({ success: true, message: 'Producto eliminado' });
    }
    catch (e) {
        next(e);
    }
});
export default router;

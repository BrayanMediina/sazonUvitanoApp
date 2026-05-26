import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.js';
import { createDelivery, store, updateDelivery } from '../store.js';
import { emitSocketEvent } from '../socket.js';
const router = Router();
const createDeliverySchema = z.object({
    orderId: z.string().min(1),
    driverName: z.string().min(1),
    status: z.enum(['Asignado', 'En camino', 'Entregado'])
});
const locationSchema = z.object({
    id: z.string().min(1),
    lat: z.number(),
    lng: z.number()
});
router.post('/deliveries', authMiddleware, (req, res) => {
    const parsed = createDeliverySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const delivery = {
        id: `delivery-${store.deliveries.length + 1}`,
        orderId: parsed.data.orderId,
        driverId: parsed.data.driverName,
        status: parsed.data.status,
        currentLat: 4.6987,
        currentLng: -74.1113,
        createdAt: new Date().toISOString()
    };
    createDelivery(delivery);
    emitSocketEvent('delivery-location', delivery);
    res.status(201).json(delivery);
});
router.patch('/deliveries/location', authMiddleware, (req, res) => {
    const parsed = locationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    updateDelivery(parsed.data.id, { currentLat: parsed.data.lat, currentLng: parsed.data.lng, status: 'En camino' });
    emitSocketEvent('delivery-location', { id: parsed.data.id, lat: parsed.data.lat, lng: parsed.data.lng });
    res.json({ ok: true });
});
export { router as deliveryRoutes };

import { Router } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/auth.js';
import { createPayment, store } from '../store.js';
import { emitSocketEvent } from '../socket.js';
const router = Router();
const paymentSchema = z.object({
    orderId: z.string().min(1),
    amount: z.number().nonnegative(),
    method: z.enum(['Efectivo', 'Tarjeta', 'Transferencia'])
});
router.post('/payments', authMiddleware, (req, res) => {
    const parsed = paymentSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const payment = {
        id: `payment-${store.payments.length + 1}`,
        orderId: parsed.data.orderId,
        amount: parsed.data.amount,
        method: parsed.data.method,
        paidAt: new Date().toISOString()
    };
    createPayment(payment);
    emitSocketEvent('payment-completed', payment);
    res.status(201).json(payment);
});
router.get('/payments/report/daily', authMiddleware, (_req, res) => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dailyPayments = store.payments.filter((payment) => new Date(payment.paidAt) >= start);
    const dailyRevenue = dailyPayments.reduce((acc, payment) => acc + payment.amount, 0);
    res.json({
        dailyRevenue,
        dailyOrders: dailyPayments.length,
        payments: dailyPayments
    });
});
export { router as paymentRoutes };

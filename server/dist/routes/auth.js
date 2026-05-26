import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../env.js';
import { getUserByEmail } from '../store.js';
const router = Router();
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
});
const refreshSchema = z.object({
    refreshToken: z.string().min(10)
});
function createTokens(user) {
    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}
router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const user = getUserByEmail(parsed.data.email);
    if (!user) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
    }
    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
    }
    const tokens = createTokens(user);
    res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});
router.post('/refresh', (req, res) => {
    const parsed = refreshSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const payload = jwt.verify(parsed.data.refreshToken, env.JWT_REFRESH_SECRET);
        const user = getUserByEmail(payload.email ?? '');
        if (!user) {
            res.status(401).json({ error: 'Refresh inválido' });
            return;
        }
        res.json({
            ...createTokens(user),
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    catch {
        res.status(401).json({ error: 'Refresh inválido' });
    }
});
router.post('/logout', (_req, res) => {
    res.json({ ok: true });
});
export { router as authRoutes };

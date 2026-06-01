import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/error.middleware.js'

// Rutas
import authRoutes      from './modules/auth/auth.routes.js'
import usersRoutes     from './modules/users/users.routes.js'
import tablesRoutes    from './modules/tables/tables.routes.js'
import productsRoutes  from './modules/products/products.routes.js'
import ordersRoutes    from './modules/orders/orders.routes.js'
import paymentsRoutes  from './modules/payments/payments.routes.js'
import deliveriesRoutes from './modules/deliveries/deliveries.routes.js'
import reportsRoutes   from './modules/reports/reports.routes.js'

export const app = express()

// ─── SEGURIDAD ────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

// CORS: abierto para todos los orígenes — auth vía Bearer token, no cookies
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options('*', cors({ origin: '*' }))   // pre-flight para todos los endpoints
app.use(rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max:      env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders:   false,
}))

// ─── PARSERS ──────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── HEALTH ───────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'sazon-uvitano-backend' }))

// ─── RUTAS API ────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/users',      usersRoutes)
app.use('/api/tables',     tablesRoutes)
app.use('/api/products',   productsRoutes)
app.use('/api/orders',     ordersRoutes)
app.use('/api/payments',   paymentsRoutes)
app.use('/api/deliveries', deliveriesRoutes)
app.use('/api/reports',    reportsRoutes)

// ─── 404 ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Ruta no encontrada' }))

// ─── ERROR HANDLER ────────────────────────────────────────────
app.use(errorHandler)

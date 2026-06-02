import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  PORT:               z.coerce.number().default(3000),
  NODE_ENV:           z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL:       z.string().min(1),
  JWT_SECRET:         z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN:     z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN:        z.string().default('http://localhost:5173,http://localhost:8080,*.vercel.app'),
  RATE_LIMIT_WINDOW_MS:     z.coerce.number().default(900_000),   // 15 min
  RATE_LIMIT_MAX_REQUESTS:  z.coerce.number().default(500),       // 500 req/15 min por IP
  // Web Push (VAPID) — opcionales para que dev funcione sin configurar
  VAPID_SUBJECT:     z.string().default('mailto:julian.mediina@gmail.com'),
  VAPID_PUBLIC_KEY:  z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)

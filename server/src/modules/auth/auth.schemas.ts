import { z } from 'zod'

export const loginSchema = z.object({
  document: z.string().min(5),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  name:     z.string().min(3),
  document: z.string().min(5),
  email:    z.string().email().optional(),
  phone:    z.string().optional(),
  password: z.string().min(6),
  role:     z.enum(['mesero', 'cajero', 'domiciliario', 'administrador']).default('mesero'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
})

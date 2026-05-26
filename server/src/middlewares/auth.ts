import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' })
    return
  }

  const token = authorization.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { sub?: string; email?: string; role?: string }
    req.user = {
      id: payload.sub ?? '',
      email: payload.email ?? '',
      role: payload.role ?? 'mesero'
    }

    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}

export function requireRole(role: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Permiso denegado' })
      return
    }

    next()
  }
}

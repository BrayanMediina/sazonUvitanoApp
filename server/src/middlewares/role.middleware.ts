import type { Response, NextFunction } from 'express'
import type { AuthRequest } from './auth.middleware.js'

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Acceso no permitido para este rol' })
      return
    }
    next()
  }
}

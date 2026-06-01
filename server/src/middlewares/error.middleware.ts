import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status  = (err as any).status ?? 500
  const message = err instanceof Error ? err.message : 'Error interno del servidor'
  res.status(status).json({ success: false, message })
}

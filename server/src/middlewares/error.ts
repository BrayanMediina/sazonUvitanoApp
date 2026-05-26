import type { ErrorRequestHandler } from 'express'
import { logger } from '../logger.js'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error(error)
  res.status(500).json({ error: error instanceof Error ? error.message : 'Error interno' })
}

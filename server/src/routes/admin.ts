import { Router } from 'express'
import { z } from 'zod'
import { authMiddleware, requireRole } from '../middlewares/auth.js'
import { createProduct, createOrder, store, upsertTable } from '../store.js'

const router = Router()

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  category: z.string().min(1)
})

const tableSchema = z.object({
  number: z.number().int().positive(),
  status: z.enum(['Disponible', 'Ocupada', 'Pendiente pago']),
  seats: z.number().int().positive()
})

router.get('/tables', authMiddleware, (_req, res) => {
  res.json(store.tables)
})

router.post('/tables', authMiddleware, requireRole('admin'), (req, res) => {
  const parsed = tableSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const table = {
    id: `table-${parsed.data.number}`,
    number: parsed.data.number,
    status: parsed.data.status,
    seats: parsed.data.seats
  }

  upsertTable(table)
  res.status(201).json(table)
})

router.get('/products', authMiddleware, (_req, res) => {
  res.json(store.products)
})

router.post('/products', authMiddleware, requireRole('admin'), (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const product = {
    id: `product-${store.products.length + 1}`,
    name: parsed.data.name,
    price: parsed.data.price,
    category: parsed.data.category
  }

  createProduct(product)
  res.status(201).json(product)
})

export { router as adminRoutes }

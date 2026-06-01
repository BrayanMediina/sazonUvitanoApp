import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  tableId: z.number(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
  total: z.number().min(0),
  createdAt: z.date(),
});

export type Order = z.infer<typeof orderSchema>;

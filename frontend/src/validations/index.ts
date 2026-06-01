import { z } from 'zod';

export const deliverySchema = z.object({
  id: z.string(),
  orderId: z.string(),
  driverId: z.string(),
  address: z.string(),
  phone: z.string(),
  status: z.enum(['pending', 'assigned', 'in_delivery', 'delivered', 'cancelled']),
  createdAt: z.date(),
});

export type Delivery = z.infer<typeof deliverySchema>;

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppStore } from '../store'
import { ordersService } from '../services/api'
import type { OrderStatus } from '../types'

export function useOrders(status?: OrderStatus) {
  const setOrders = useAppStore((s) => s.setOrders)

  return useQuery({
    queryKey: ['orders', status],
    queryFn: async () => {
      const data = await ordersService.getAll(status ? { status } : undefined)
      setOrders(data)
      return data
    },
    refetchInterval: 20_000,
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getById(id),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
  })
}

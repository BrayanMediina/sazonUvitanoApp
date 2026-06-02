import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../store'
import { deliveriesService } from '../services/api'
import type { DeliveryStatus } from '../types'

export function useDeliveries(status?: DeliveryStatus) {
  const setDeliveries = useAppStore((s) => s.setDeliveries)

  return useQuery({
    queryKey: ['deliveries', status],
    queryFn: async () => {
      const data = await deliveriesService.getAll(status ? { status } : undefined)
      setDeliveries(data)
      return data
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  })
}

export function useMyDeliveries() {
  return useQuery({
    queryKey: ['deliveries', 'my'],
    queryFn: () => deliveriesService.getMyDeliveries(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  })
}

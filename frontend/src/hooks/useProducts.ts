import { useQuery } from '@tanstack/react-query'
import { productsService } from '../services/api'
import type { ProductCategory } from '../types'

export function useProducts(category?: ProductCategory, onlyAvailable = false) {
  return useQuery({
    queryKey: ['products', category, onlyAvailable],
    queryFn: () => productsService.getAll({ category, isAvailable: onlyAvailable || undefined }),
    staleTime: 5 * 60_000,     // 5 min — el menú no cambia cada segundo
    refetchOnWindowFocus: false, // evita ráfagas al volver a la pestaña
  })
}

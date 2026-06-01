import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService } from '../services/api'
import type { Role } from '../types'

export function useUsers(role?: Role) {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => usersService.getAll(role ? { role } : undefined),
  })
}

export function useDrivers() {
  return useQuery({
    queryKey: ['users', 'domiciliario'],
    queryFn: () => usersService.getAll({ role: 'domiciliario' }),
    select: (data) => data.data.filter((u) => u.isActive),
  })
}

export function useToggleUserActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.toggleActive(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }) },
  })
}

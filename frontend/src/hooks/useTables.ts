import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../store'
import { tablesService } from '../services/api'

export function useTables() {
  const setTables = useAppStore((s) => s.setTables)

  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const data = await tablesService.getAll()
      setTables(data)
      return data
    },
    refetchInterval: 30_000,
  })
}

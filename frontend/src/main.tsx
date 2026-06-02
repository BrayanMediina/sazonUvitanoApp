import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// VitePWA registra el SW automáticamente via injectRegister: 'auto'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppRouter from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // 1 min por defecto — evita refetches innecesarios
      retry: 1,
      refetchOnWindowFocus: false, // no disparar requests al volver de otra pestaña
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </StrictMode>,
)

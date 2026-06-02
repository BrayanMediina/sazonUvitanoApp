import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Registrar Service Worker para push notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => { /* silencioso */ })
}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppRouter from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
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

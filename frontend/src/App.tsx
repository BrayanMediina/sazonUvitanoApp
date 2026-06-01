import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAppStore } from './store'
import { appConfig } from './config'

// Módulos
import LoginPage from './modules/login/LoginPage'
import DashboardPage from './modules/dashboard/DashboardPage'
import MesasPage from './modules/mesas/MesasPage'
import PedidosPage from './modules/pedidos/PedidosPage'
import CajaPage from './modules/caja/CajaPage'
import DomiciliosPage from './modules/domicilios/DomiciliosPage'
import MapaPage from './modules/mapa/MapaPage'
import ChatPage from './modules/chat/ChatPage'
import ReportesPage from './modules/reportes/ReportesPage'
import AdminPage from './modules/admin/AdminPage'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAppStore((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const user = useAppStore((state) => state.user)
  const setOnline = useAppStore((state) => state.setOnline)

  // Inicializar sesión desde localStorage
  useEffect(() => {
    const accessToken = localStorage.getItem('sazon-access')
    const refreshTokenStored = localStorage.getItem('sazon-refresh')

    if (accessToken && refreshTokenStored && !user) {
      try {
        // Aquí se podría hacer un refresh token para validar la sesión
      } catch (error) {
        console.error('Error al restaurar sesión:', error)
        localStorage.removeItem('sazon-access')
        localStorage.removeItem('sazon-refresh')
      }
    }
  }, [user])

  // WebSocket para tiempo real
  useEffect(() => {
    if (!user) return

    const socket = io(appConfig.socketUrl, {
      auth: { token: localStorage.getItem('sazon-access') }
    })

    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket')
      setOnline(true)
    })

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket')
      setOnline(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [user, setOnline])

  // Verificar conexión de red
  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mesas"
        element={
          <ProtectedRoute>
            <MesasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <PedidosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/caja"
        element={
          <ProtectedRoute>
            <CajaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/domicilios"
        element={
          <ProtectedRoute>
            <DomiciliosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mapa"
        element={
          <ProtectedRoute>
            <MapaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <ReportesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

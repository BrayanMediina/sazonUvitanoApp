import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAppStore, type AppStore } from '../store'
import type { Role } from '../types'
import PageLoader from '../components/ui/PageLoader'

// ─── LAZY IMPORTS (code splitting) ───────────────────────────
const LoginPage          = lazy(() => import('../modules/auth/LoginPage'))
const DashboardPage      = lazy(() => import('../modules/dashboard/DashboardPage'))
const ChatPage           = lazy(() => import('../modules/chat/ChatPage'))
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'))

// Mesero
const MesasPage          = lazy(() => import('../modules/mesas/MesasPage'))
const MesaDetallePage    = lazy(() => import('../modules/mesas/MesaDetallePage'))
const PedidoNuevoPage    = lazy(() => import('../modules/pedidos/PedidoNuevoPage'))
const PedidoDetallePage  = lazy(() => import('../modules/pedidos/PedidoDetallePage'))

// Cajero
const CajaPage           = lazy(() => import('../modules/caja/CajaPage'))
const DomiciliosPage     = lazy(() => import('../modules/domicilios/DomiciliosPage'))
const DomicilioNuevoPage = lazy(() => import('../modules/domicilios/DomicilioNuevoPage'))
const MapaPage           = lazy(() => import('../modules/mapa/MapaPage'))

// Domiciliario
const MisEntregasPage    = lazy(() => import('../modules/domicilios/MisEntregasPage'))

// Administrador
const AdminPage          = lazy(() => import('../modules/admin/AdminPage'))
const AdminUsuariosPage  = lazy(() => import('../modules/admin/usuarios/UsuariosPage'))
const AdminProductosPage = lazy(() => import('../modules/admin/productos/ProductosPage'))
const AdminMesasPage     = lazy(() => import('../modules/admin/mesas/MesasAdminPage'))
const ReportesPage       = lazy(() => import('../modules/reportes/ReportesPage'))

// ─── PERMISOS POR ROL ─────────────────────────────────────────
export const ROLE_ROUTES: Record<Role, string[]> = {
  mesero: ['/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id', '/chat'],
  cajero: ['/dashboard', '/mesas', '/mesas/:id', '/caja', '/domicilios', '/domicilios/nuevo', '/mapa', '/chat', '/reportes'],
  domiciliario: ['/dashboard', '/mis-entregas', '/mapa', '/chat'],
  administrador: [
    '/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id',
    '/caja', '/domicilios', '/domicilios/nuevo', '/mapa', '/chat',
    '/reportes', '/admin', '/admin/usuarios', '/admin/productos', '/admin/mesas',
  ],
}

// ─── GUARD: requiere auth ─────────────────────────────────────
function RequireAuth() {
  const user  = useAppStore((s) => (s as AppStore).user)
  const token = useAppStore((s) => (s as AppStore).accessToken)
  if (!user || !token) return <Navigate to="/login" replace />
  return <Outlet />
}

// ─── GUARD: requiere rol ──────────────────────────────────────
function RequireRole({ roles }: { roles: Role[] }) {
  const user = useAppStore((s) => (s as AppStore).user)
  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

// ─── REDIRECT INICIAL ────────────────────────────────────────
function RoleRedirect() {
  const user = useAppStore((s) => (s as AppStore).user)
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to="/dashboard" replace />
}

// ─── ROUTER PRINCIPAL ─────────────────────────────────────────
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RoleRedirect />} />

          {/* Protegidas */}
          <Route element={<RequireAuth />}>
            {/* Todos los roles */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route element={<RequireRole roles={['administrador','cajero','domiciliario','mesero']} />}>
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* Mesero + Cajero + Admin */}
            <Route element={<RequireRole roles={['administrador','cajero','mesero']} />}>
              <Route path="/mesas" element={<MesasPage />} />
              <Route path="/mesas/:id" element={<MesaDetallePage />} />
            </Route>
            <Route element={<RequireRole roles={['administrador','cajero','mesero']} />}>
              <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
            </Route>
            <Route element={<RequireRole roles={['administrador','mesero']} />}>
              <Route path="/pedidos/nuevo" element={<PedidoNuevoPage />} />
            </Route>

            {/* Cajero + Admin */}
            <Route element={<RequireRole roles={['administrador','cajero']} />}>
              <Route path="/caja" element={<CajaPage />} />
              <Route path="/domicilios" element={<DomiciliosPage />} />
              <Route path="/domicilios/nuevo" element={<DomicilioNuevoPage />} />
            </Route>
            <Route element={<RequireRole roles={['administrador','cajero','domiciliario']} />}>
              <Route path="/mapa" element={<MapaPage />} />
            </Route>

            {/* Domiciliario */}
            <Route element={<RequireRole roles={['domiciliario']} />}>
              <Route path="/mis-entregas" element={<MisEntregasPage />} />
            </Route>

            {/* Admin + Cajero */}
            <Route element={<RequireRole roles={['administrador','cajero']} />}>
              <Route path="/reportes" element={<ReportesPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
              <Route path="/admin/productos" element={<AdminProductosPage />} />
              <Route path="/admin/mesas" element={<AdminMesasPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// ─── HELPER: navItems por rol para el BottomNav ───────────────
export const NAV_ITEMS_BY_ROLE: Record<Role, { path: string; label: string; icon: string }[]> = {
  mesero: [
    { path: '/dashboard', label: 'Inicio',  icon: 'home' },
    { path: '/mesas',     label: 'Mesas',   icon: 'grid' },
    { path: '/chat',      label: 'Chat',    icon: 'chat' },
  ],
  cajero: [
    { path: '/dashboard',  label: 'Inicio',     icon: 'home' },
    { path: '/mesas',      label: 'Mesas',      icon: 'grid' },
    { path: '/caja',       label: 'Caja',       icon: 'cash' },
    { path: '/domicilios', label: 'Domicilios', icon: 'truck' },
    { path: '/chat',       label: 'Chat',       icon: 'chat' },
  ],
  domiciliario: [
    { path: '/dashboard',    label: 'Inicio',   icon: 'home' },
    { path: '/mis-entregas', label: 'Entregas', icon: 'package' },
    { path: '/mapa',         label: 'Mapa',     icon: 'map' },
    { path: '/chat',         label: 'Chat',     icon: 'chat' },
  ],
  administrador: [
    { path: '/dashboard', label: 'Inicio',   icon: 'home' },
    { path: '/mesas',     label: 'Mesas',    icon: 'grid' },
    { path: '/caja',      label: 'Caja',     icon: 'cash' },
    { path: '/reportes',  label: 'Reportes', icon: 'chart' },
    { path: '/admin',     label: 'Admin',    icon: 'settings' },
  ],
}

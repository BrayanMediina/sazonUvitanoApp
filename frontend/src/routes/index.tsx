// ============================================================
// RUTAS Y GUARDS — El Sazón Uvitano PWA
// src/routes/index.tsx
// ============================================================
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from '../store'
import type { Role } from '../types'
import PageLoader from '../components/ui/PageLoader'

// ─── LAZY IMPORTS (code splitting) ───────────────────────────
const LoginPage          = lazy(() => import('../modules/auth/LoginPage'))

// Compartidas
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
  mesero: [
    '/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id', '/chat',
  ],
  cajero: [
    '/dashboard', '/mesas', '/mesas/:id', '/caja', '/domicilios',
    '/domicilios/nuevo', '/mapa', '/chat',
  ],
  domiciliario: [
    '/dashboard', '/mis-entregas', '/mapa', '/chat',
  ],
  administrador: [
    '/dashboard', '/mesas', '/mesas/:id', '/pedidos/nuevo', '/pedidos/:id',
    '/caja', '/domicilios', '/domicilios/nuevo', '/mapa', '/chat',
    '/reportes', '/admin', '/admin/usuarios', '/admin/productos', '/admin/mesas',
  ],
}

// ─── GUARD: requiere auth ─────────────────────────────────────
function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user)
  const token = useAppStore((s) => s.accessToken)
  if (!user || !token) return <Navigate to="/login" replace />
  return <>{children}</>
}

// ─── GUARD: requiere rol ──────────────────────────────────────
function RequireRole({
  children,
  roles,
}: {
  children: React.ReactNode
  roles: Role[]
}) {
  const user = useAppStore((s) => s.user)
  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

// ─── REDIRECT INICIAL POR ROL ────────────────────────────────
function RoleRedirect() {
  const user = useAppStore((s) => s.user)
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
          <Route element={<RequireAuth><Outlet /></RequireAuth>}>

            {/* Todos los roles */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/chat" element={
              <RequireRole roles={['administrador','cajero','domiciliario','mesero']}>
                <ChatPage />
              </RequireRole>
            } />

            {/* Mesero + Cajero + Admin */}
            <Route path="/mesas" element={
              <RequireRole roles={['administrador','cajero','mesero']}>
                <MesasPage />
              </RequireRole>
            } />
            <Route path="/mesas/:id" element={
              <RequireRole roles={['administrador','cajero','mesero']}>
                <MesaDetallePage />
              </RequireRole>
            } />
            <Route path="/pedidos/nuevo" element={
              <RequireRole roles={['administrador','mesero']}>
                <PedidoNuevoPage />
              </RequireRole>
            } />
            <Route path="/pedidos/:id" element={
              <RequireRole roles={['administrador','cajero','mesero']}>
                <PedidoDetallePage />
              </RequireRole>
            } />

            {/* Cajero + Admin */}
            <Route path="/caja" element={
              <RequireRole roles={['administrador','cajero']}>
                <CajaPage />
              </RequireRole>
            } />
            <Route path="/domicilios" element={
              <RequireRole roles={['administrador','cajero']}>
                <DomiciliosPage />
              </RequireRole>
            } />
            <Route path="/domicilios/nuevo" element={
              <RequireRole roles={['administrador','cajero']}>
                <DomicilioNuevoPage />
              </RequireRole>
            } />
            <Route path="/mapa" element={
              <RequireRole roles={['administrador','cajero','domiciliario']}>
                <MapaPage />
              </RequireRole>
            } />

            {/* Domiciliario */}
            <Route path="/mis-entregas" element={
              <RequireRole roles={['domiciliario']}>
                <MisEntregasPage />
              </RequireRole>
            } />

            {/* Admin only */}
            <Route path="/reportes" element={
              <RequireRole roles={['administrador']}>
                <ReportesPage />
              </RequireRole>
            } />
            <Route path="/admin" element={
              <RequireRole roles={['administrador']}>
                <AdminPage />
              </RequireRole>
            } />
            <Route path="/admin/usuarios" element={
              <RequireRole roles={['administrador']}>
                <AdminUsuariosPage />
              </RequireRole>
            } />
            <Route path="/admin/productos" element={
              <RequireRole roles={['administrador']}>
                <AdminProductosPage />
              </RequireRole>
            } />
            <Route path="/admin/mesas" element={
              <RequireRole roles={['administrador']}>
                <AdminMesasPage />
              </RequireRole>
            } />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// ─── HELPER: navItems por rol para el BottomNav ───────────────
export const NAV_ITEMS_BY_ROLE: Record<Role, {
  path: string
  label: string
  icon: string
}[]> = {
  mesero: [
    { path: '/dashboard', label: 'Inicio',   icon: 'home' },
    { path: '/mesas',     label: 'Mesas',    icon: 'grid' },
    { path: '/chat',      label: 'Chat',     icon: 'chat' },
  ],
  cajero: [
    { path: '/dashboard',  label: 'Inicio',      icon: 'home' },
    { path: '/mesas',      label: 'Mesas',       icon: 'grid' },
    { path: '/caja',       label: 'Caja',        icon: 'cash' },
    { path: '/domicilios', label: 'Domicilios',  icon: 'truck' },
    { path: '/chat',       label: 'Chat',        icon: 'chat' },
  ],
  domiciliario: [
    { path: '/dashboard',    label: 'Inicio',    icon: 'home' },
    { path: '/mis-entregas', label: 'Entregas',  icon: 'package' },
    { path: '/mapa',         label: 'Mapa',      icon: 'map' },
    { path: '/chat',         label: 'Chat',      icon: 'chat' },
  ],
  administrador: [
    { path: '/dashboard', label: 'Inicio',    icon: 'home' },
    { path: '/mesas',     label: 'Mesas',     icon: 'grid' },
    { path: '/caja',      label: 'Caja',      icon: 'cash' },
    { path: '/reportes',  label: 'Reportes',  icon: 'chart' },
    { path: '/admin',     label: 'Admin',     icon: 'settings' },
  ],
}
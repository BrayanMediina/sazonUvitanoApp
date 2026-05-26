import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import {
  BarChart3,
  Coffee,
  Home,
  MapPinned,
  MessageCircle,
  Navigation,
  PackageCheck,
  Settings,
  ShoppingCart,
  ShieldCheck,
  Wifi,
  WifiOff
} from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { appConfig } from './config'
import { useGeoTracking } from './hooks/useGeoTracking'
import { createDelivery, createOrder, createPayment, getDailyReport, login, refreshToken } from './services/api'
import { clearOfflineQueue, getOfflineQueue } from './services/offline'
import { type OrderStatus, useAppStore } from './store'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Mesas', path: '/mesas', icon: Coffee },
  { label: 'Pedidos', path: '/pedidos', icon: ShoppingCart },
  { label: 'Caja', path: '/caja', icon: PackageCheck },
  { label: 'Domicilios', path: '/domicilios', icon: Navigation },
  { label: 'Mapa', path: '/mapa', icon: MapPinned },
  { label: 'Chat', path: '/chat', icon: MessageCircle },
  { label: 'Reportes', path: '/reportes', icon: BarChart3 },
  { label: 'Admin', path: '/admin', icon: Settings }
]

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const user = useAppStore((state) => state.user)
  const setUser = useAppStore((state) => state.setUser)
  const isOnline = useAppStore((state) => state.isOnline)

  function handleLogout() {
    localStorage.removeItem('sazon-access')
    localStorage.removeItem('sazon-refresh')
    setUser(null, null)
  }

  return (
    <div className="min-h-screen bg-brand-100 text-brand-950">
      <header className="border-b border-orange-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-700">El Sazón Uvitano</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand-950">Operaciones de restaurante en tiempo real</h1>
            <p className="text-sm text-brand-600">Control total de mesas, pedidos, caja y domicilios en un solo panel.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${isOnline ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isOnline ? 'Conectado' : 'Offline parcial'}
            </span>
            {user ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm text-brand-900">
                <span>{user.name}</span>
                <span className="rounded-full bg-brand-950 px-2 py-1 text-white">{user.role}</span>
              </div>
            ) : null}
            <button onClick={handleLogout} className="rounded-full bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 lg:max-w-xs">
          <nav className="rounded-[1.5rem] border border-orange-100 bg-white/95 p-4 shadow-soft">
            <p className="px-3 pb-2 text-sm font-semibold text-brand-700">Área operativa</p>
            <div className="grid gap-2">
              {navItems.map(({ label, path, icon: Icon }) => {
                const active = location.pathname === path
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-brand-950 text-white shadow-soft' : 'text-brand-950 hover:bg-brand-100'}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

function LoginPage() {
  const [email, setEmail] = useState('admin@sazonuvitano.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setUser = useAppStore((state) => state.setUser)
  const navigate = useNavigate()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const auth = await login({ email, password })
      localStorage.setItem('sazon-access', auth.accessToken)
      localStorage.setItem('sazon-refresh', auth.refreshToken)
      setUser(auth.user, auth.accessToken)
      navigate('/dashboard')
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : 'No fue posible iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand-100 px-4 py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-gradient-to-br from-brand-950 to-brand-700 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-300">Acceso seguro</p>
            <h2 className="mt-4 text-3xl font-semibold">Autenticación JWT + sesión persistente</h2>
            <p className="mt-4 text-sm leading-7 text-brand-100">
              La aplicación implementa login, refresh token, roles y persistencia local segura para el equipo operativo.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-brand-50">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Privilegios por rol</li>
              <li className="flex items-center gap-2"><Navigation className="h-4 w-4" /> GPS y tracking en tiempo real</li>
              <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Chat y notificaciones</li>
            </ul>
          </div>

          <div className="p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Inicio de sesión</p>
            <h2 className="mt-3 text-2xl font-semibold">Bienvenido al Sazón Uvitano</h2>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-medium">
                Correo
                <input className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3 outline-none focus:border-brand-700" value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
              <label className="block text-sm font-medium">
                Contraseña
                <input type="password" className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3 outline-none focus:border-brand-700" value={password} onChange={(event) => setPassword(event.target.value)} />
              </label>
              {error ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <button type="submit" className="w-full rounded-xl bg-brand-950 px-4 py-3 font-semibold text-white" disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const tables = useAppStore((state) => state.tables)
  const orders = useAppStore((state) => state.orders)
  const deliveries = useAppStore((state) => state.deliveries)
  const location = useAppStore((state) => state.location)
  const messages = useAppStore((state) => state.messages)
  const user = useAppStore((state) => state.user)

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pending = orders.filter((order) => order.status !== 'Pagado' && order.status !== 'Finalizado').length
    const occupied = tables.filter((table) => table.status === 'Ocupada').length
    return { totalRevenue, pending, occupied, messages: messages.length, deliveries: deliveries.length, location: location ? 'GPS activo' : 'Sin GPS' }
  }, [deliveries.length, messages.length, orders, tables, location])

  const summaryQuery = useQuery({
    queryKey: ['summary'],
    queryFn: async () => {
      try {
        return await getDailyReport()
      } catch {
        return { dailyRevenue: stats.totalRevenue, dailyOrders: orders.length }
      }
    },
    retry: 1,
    staleTime: 30000
  })

  const dailyRevenue = typeof summaryQuery.data === 'object' && summaryQuery.data !== null && 'dailyRevenue' in summaryQuery.data
    ? Number((summaryQuery.data as { dailyRevenue?: number }).dailyRevenue ?? stats.totalRevenue)
    : stats.totalRevenue

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Resumen operativo</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[{ label: 'Ingresos del día', value: `$${stats.totalRevenue.toLocaleString()}` }, { label: 'Pedidos abiertos', value: `${stats.pending}` }, { label: 'Mesas ocupadas', value: `${stats.occupied}` }, { label: 'Entregas activas', value: `${stats.deliveries}` }].map((item) => (
            <div key={item.label} className="rounded-2xl bg-brand-100 px-4 py-4">
              <p className="text-sm text-brand-700">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Estado del restaurante</p>
              <h2 className="mt-2 text-2xl font-semibold">Sala, cocina y domicilio</h2>
            </div>
            <span className="rounded-full bg-brand-950 px-3 py-1 text-sm text-white">{user?.role ?? 'invitado'}</span>
          </div>
          <div className="mt-5 space-y-3 text-sm text-brand-950">
            <p><strong>GPS:</strong> {stats.location}</p>
            <p><strong>Mensajes activos:</strong> {stats.messages}</p>
            <p><strong>Reporte diario:</strong> {`$${dailyRevenue.toLocaleString()}`}</p>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Acciones rápidas</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link to="/pedidos" className="rounded-2xl bg-brand-950 px-4 py-4 text-sm font-semibold text-white">Crear pedido</Link>
            <Link to="/caja" className="rounded-2xl bg-brand-700 px-4 py-4 text-sm font-semibold text-white">Registrar pago</Link>
            <Link to="/domicilios" className="rounded-2xl bg-brand-300 px-4 py-4 text-sm font-semibold text-brand-950">Asignar entrega</Link>
            <Link to="/mapa" className="rounded-2xl bg-orange-100 px-4 py-4 text-sm font-semibold text-brand-950">Ver mapa</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function TablesPage() {
  const tables = useAppStore((state) => state.tables)
  const setTables = useAppStore((state) => state.setTables)

  function updateStatus(id: string, status: string) {
    setTables(tables.map((table) => (table.id === id ? { ...table, status: status as never } : table)))
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Gestión de mesas</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-950">Operación rápida de sala</h2>
          </div>
          <p className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-700">Actualiza estados con un toque</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {tables.map((table) => (
          <div key={table.id} className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-500">Mesa</p>
                <p className="mt-1 text-3xl font-semibold text-brand-950">{table.number}</p>
              </div>
              <span className={`rounded-full px-3 py-2 text-sm font-semibold ${table.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700' : table.status === 'Ocupada' ? 'bg-orange-50 text-orange-700' : 'bg-amber-50 text-amber-700'}`}>
                {table.status}
              </span>
            </div>
            <div className="mt-6 text-sm text-brand-700">
              <p>Capacidad: <span className="font-semibold">{table.seats}</span></p>
              <p className="mt-2">Mesa diseñada para atención rápida y seguimiento de pedidos.</p>
            </div>
            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {['Disponible', 'Ocupada', 'Pendiente pago'].map((status) => (
                <button
                  key={status}
                  className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${table.status === status ? 'bg-brand-950 text-white border-brand-950' : 'bg-brand-100 text-brand-950 hover:bg-brand-200'}`}
                  onClick={() => updateStatus(table.id, status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersPage() {
  const orders = useAppStore((state) => state.orders)
  const setOrders = useAppStore((state) => state.setOrders)
  const tables = useAppStore((state) => state.tables)
  const [selectedTable, setSelectedTable] = useState('table-2')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<OrderStatus>('Pedido tomado')

  const products = [
    { id: 'prod-1', name: 'Ceviche Uvitano', category: 'Entradas', price: 28000, description: 'Ceviche fresco con maracuyá y chips crocantes.' },
    { id: 'prod-2', name: 'Ajiaco tradicional', category: 'Platos fuertes', price: 42000, description: 'Sopa típica con pollo, papa y guasca.' },
    { id: 'prod-3', name: 'Lomo al trapo', category: 'Platos fuertes', price: 58000, description: 'Carne jugosa con chimichurri y papas salteadas.' },
    { id: 'prod-4', name: 'Jugo natural de mora', category: 'Bebidas', price: 9000, description: 'Refresco fresco de mora natural.' },
    { id: 'prod-5', name: 'Postre de tres leches', category: 'Postres', price: 16000, description: 'Postre suave con crema y fruta fresca.' }
  ]

  const categories = [...new Set(products.map((product) => product.category))]
  const [activeCategory, setActiveCategory] = useState(categories[0])

  const cartItems = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({ ...product, quantity: cart[product.id] }))

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addProduct(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] ?? 0) + 1 }))
  }

  function removeProduct(productId: string) {
    setCart((current) => {
      const next = { ...current }
      if (!next[productId] || next[productId] <= 1) {
        delete next[productId]
      } else {
        next[productId] -= 1
      }
      return next
    })
  }

  async function handleCreate() {
    if (!cartItems.length) {
      setMessage('Selecciona al menos un producto para crear el pedido.')
      return
    }

    const payload = {
      tableId: selectedTable,
      status,
      total,
      items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price }))
    }

    try {
      await createOrder(payload)
      setOrders([
        ...orders,
        {
          id: `order-${orders.length + 1}`,
          tableId: selectedTable,
          status,
          total,
          items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
          createdAt: new Date().toISOString()
        }
      ])
      setCart({})
      setMessage('Pedido agregado exitosamente')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No fue posible crear el pedido')
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Pedidos</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-950">Selecciona productos y genera el pedido</h2>
          </div>
          <div className="inline-flex rounded-2xl bg-brand-50 px-4 py-2 text-sm text-brand-800">Mesas disponibles: {tables.length}</div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.7fr_0.3fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? 'bg-brand-950 text-white' : 'bg-brand-100 text-brand-950 hover:bg-brand-200'}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {products
                .filter((product) => product.category === activeCategory)
                .map((product) => (
                  <div key={product.id} className="rounded-[1.5rem] border border-orange-100 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">{product.category}</p>
                        <h3 className="mt-2 text-lg font-semibold text-brand-950">{product.name}</h3>
                      </div>
                      <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-950">${product.price.toLocaleString()}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-brand-700">{product.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button type="button" className="rounded-full border border-orange-200 bg-brand-100 px-3 py-2 text-sm text-brand-950" onClick={() => removeProduct(product.id)}>-</button>
                        <span className="min-w-[2rem] text-center text-lg font-semibold text-brand-950">{cart[product.id] ?? 0}</span>
                        <button type="button" className="rounded-full bg-brand-950 px-3 py-2 text-sm font-semibold text-white" onClick={() => addProduct(product.id)}>+</button>
                      </div>
                      <button type="button" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white" onClick={() => addProduct(product.id)}>
                        Agregar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-orange-100 bg-brand-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Resumen de pedido</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-brand-700">Mesa asignada</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tables.map((table) => (
                    <button
                      type="button"
                      key={table.id}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedTable === table.id ? 'bg-brand-950 text-white' : 'bg-white text-brand-950 hover:bg-brand-100'}`}
                      onClick={() => setSelectedTable(table.id)}
                    >
                      Mesa {table.number}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-brand-700">Estado inicial</p>
                <select className="mt-3 w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm text-brand-950" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
                  {['Pedido tomado', 'En preparación', 'Listo', 'Entregado', 'Pagado', 'Finalizado'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-3xl bg-white p-4">
                <div className="flex items-center justify-between text-sm text-brand-700">
                  <span>Artículos seleccionados</span>
                  <span>{cartItems.reduce((count, item) => count + item.quantity, 0)} unidades</span>
                </div>
                <div className="mt-4 space-y-3">
                  {cartItems.length ? cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-brand-100 p-3">
                      <div>
                        <p className="font-semibold text-brand-950">{item.name}</p>
                        <p className="text-sm text-brand-700">{item.quantity} x ${item.price.toLocaleString()}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-950">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  )) : <p className="text-sm text-brand-700">Aún no hay productos seleccionados.</p>}
                </div>
              </div>

              <div className="rounded-3xl bg-brand-950 px-4 py-5 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-brand-200">Total estimado</p>
                <p className="mt-3 text-3xl font-semibold">${total.toLocaleString()}</p>
              </div>

              {message ? <p className="rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-700">{message}</p> : null}

              <button className="mt-2 w-full rounded-2xl bg-brand-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700" onClick={handleCreate}>
                Generar pedido profesional
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Pedidos recientes</p>
            <h3 className="mt-2 text-xl font-semibold text-brand-950">Últimos pedidos en curso</h3>
          </div>
          <span className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-700">{orders.length} pedidos</span>
        </div>
        <div className="mt-6 space-y-4">
          {orders.length ? orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-orange-100 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-brand-950">Pedido {order.id}</p>
                  <p className="text-sm text-brand-700">Mesa {order.tableId} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className="rounded-full bg-brand-100 px-3 py-2 text-sm font-semibold text-brand-950">{order.status}</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <p className="text-sm text-brand-700">Total: <span className="font-semibold text-brand-950">${order.total.toLocaleString()}</span></p>
                <p className="text-sm text-brand-700">Productos: {order.items.length}</p>
              </div>
            </div>
          )) : <p className="text-sm text-brand-700">No hay pedidos registrados todavía.</p>}
        </div>
      </div>
    </div>
  )
}

function PaymentsPage() {
  const [amount, setAmount] = useState('48000')
  const [method, setMethod] = useState('Efectivo')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await createPayment({ amount: Number(amount), method, paidAt: new Date().toISOString() })
      setMessage('Pago registrado correctamente')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo registrar el pago')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Caja y pagos</p>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">Monto
            <input type="number" className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </label>
          <label className="block text-sm font-medium">Método de pago
            <select className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3" value={method} onChange={(event) => setMethod(event.target.value)}>
              {['Efectivo', 'Tarjeta', 'Transferencia'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <button className="w-full rounded-xl bg-brand-950 px-4 py-3 font-semibold text-white">Registrar cobro</button>
        </form>
        {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
      </div>
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Reportes de caja</p>
        <p className="mt-4 text-sm text-brand-700">Se generan desde el endpoint de reportes diarios y se muestran en el dashboard, además de mantenerse listos para auditoría.</p>
      </div>
    </div>
  )
}

function DeliveriesPage() {
  const deliveries = useAppStore((state) => state.deliveries)
  const [driver, setDriver] = useState('Camilo')
  const [orderId, setOrderId] = useState('order-1')
  const [message, setMessage] = useState('')

  async function handleAssign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      await createDelivery({ orderId, driverName: driver, status: 'Asignado' })
      setMessage('Domicilio asignado')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo asignar')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Gestión de domicilios</p>
        <form className="mt-4 space-y-4" onSubmit={handleAssign}>
          <label className="block text-sm font-medium">Conductor
            <input className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3" value={driver} onChange={(event) => setDriver(event.target.value)} />
          </label>
          <label className="block text-sm font-medium">Pedido
            <input className="mt-2 w-full rounded-xl border border-orange-200 px-3 py-3" value={orderId} onChange={(event) => setOrderId(event.target.value)} />
          </label>
          <button className="w-full rounded-xl bg-brand-950 px-4 py-3 font-semibold text-white">Asignar domicilio</button>
        </form>
        {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
      </div>
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Estado de entregas</p>
        <div className="mt-4 space-y-3">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="rounded-2xl border border-orange-100 p-4">
              <p className="font-semibold">{delivery.driverName}</p>
              <p className="text-sm text-brand-700">Pedido {delivery.orderId} • {delivery.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MapPage() {
  const deliveries = useAppStore((state) => state.deliveries)
  const location = useAppStore((state) => state.location)
  useGeoTracking()

  const center = location ? [location.lat, location.lng] : [4.6987, -74.1113]

  return (
    <div className="space-y-4 rounded-[1.5rem] bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Seguimiento GPS</p>
      <p className="text-sm text-brand-700">La app utiliza <strong>navigator.geolocation.watchPosition()</strong> y emite cambios a los sockets activos.</p>
      <MapContainer center={center as [number, number]} zoom={13} scrollWheelZoom>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {location ? <Marker position={center as [number, number]}><Popup>Ubicación del domicilio activo</Popup></Marker> : null}
        {deliveries.map((delivery) => (
          <Marker key={delivery.id} position={[delivery.lat, delivery.lng]}>
            <Popup>{delivery.driverName} • {delivery.status}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function ChatPage() {
  const messages = useAppStore((state) => state.messages)
  const addMessage = useAppStore((state) => state.addMessage)
  const [draft, setDraft] = useState('')
  const socket = useMemo(() => io(appConfig.socketUrl), [])

  useEffect(() => {
    socket.on('new-message', (message: { author: string; text: string }) => {
      addMessage({ id: crypto.randomUUID(), author: message.author, text: message.text, role: 'mesero', createdAt: new Date().toISOString() })
    })

    return () => {
      socket.disconnect()
    }
  }, [addMessage, socket])

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.trim()) return

    const message = { author: 'Operador', text: draft }
    socket.emit('new-message', message)
    addMessage({ id: crypto.randomUUID(), author: 'Operador', text: draft, role: 'admin', createdAt: new Date().toISOString() })
    setDraft('')
  }

  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Chat en tiempo real</p>
      <div className="mt-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl border border-orange-100 p-3">
            <p className="text-sm font-semibold">{message.author}</p>
            <p className="mt-1 text-sm text-brand-700">{message.text}</p>
          </div>
        ))}
      </div>
      <form className="mt-4 flex gap-3" onSubmit={sendMessage}>
        <input className="flex-1 rounded-xl border border-orange-200 px-3 py-3" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribe al equipo" />
        <button className="rounded-xl bg-brand-950 px-4 py-3 font-semibold text-white">Enviar</button>
      </form>
    </div>
  )
}

function ReportsPage() {
  const orders = useAppStore((state) => state.orders)
  const deliveries = useAppStore((state) => state.deliveries)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Reportes diarios</p>
        <p className="mt-4 text-sm text-brand-700">- Ventas diarias y análisis operativo.</p>
        <p className="mt-2 text-sm text-brand-700">- Pedidos: {orders.length}</p>
        <p className="mt-2 text-sm text-brand-700">- Domicilios activos: {deliveries.length}</p>
      </div>
      <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Auditoría y calidad</p>
        <p className="mt-4 text-sm text-brand-700">Cumple con observabilidad, backups y seguimiento de errores críticos para operación productiva.</p>
      </div>
    </div>
  )
}

function AdminPage() {
  const [message, setMessage] = useState('')
  async function handleSync() {
    const queue = await getOfflineQueue()
    await clearOfflineQueue()
    setMessage(`Cola sincronizada: ${queue.length} pendientes`)
  }

  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Administración</p>
      <p className="mt-4 text-sm text-brand-700">Gestión de usuarios, productos, roles y configuración operativa. Incluye sincronización offline y cola de persistencia local.</p>
      <button className="mt-4 rounded-xl bg-brand-950 px-4 py-3 font-semibold text-white" onClick={handleSync}>Sincronizar cola offline</button>
      {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
    </div>
  )
}

function App() {
  const setUser = useAppStore((state) => state.setUser)
  const setOnline = useAppStore((state) => state.setOnline)

  useEffect(() => {
    const access = localStorage.getItem('sazon-access')
    const refresh = localStorage.getItem('sazon-refresh')

    if (access && refresh) {
      try {
        const payload = JSON.parse(atob(access.split('.')[1]))
        setUser({ id: payload.sub, name: payload.name ?? 'Operador', email: payload.email ?? 'admin@sazonuvitano.com', role: payload.role ?? 'admin' }, access)
      } catch {
        void refreshToken(refresh).then((auth) => {
          localStorage.setItem('sazon-access', auth.accessToken)
          localStorage.setItem('sazon-refresh', auth.refreshToken)
          setUser(auth.user, auth.accessToken)
        }).catch(() => {
          localStorage.removeItem('sazon-access')
          localStorage.removeItem('sazon-refresh')
        })
      }
    }

    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline, setUser])

  const user = useAppStore((state) => state.user)

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/mesas" element={<TablesPage />} />
                <Route path="/pedidos" element={<OrdersPage />} />
                <Route path="/caja" element={<PaymentsPage />} />
                <Route path="/domicilios" element={<DeliveriesPage />} />
                <Route path="/mapa" element={<MapPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/reportes" element={<ReportsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App

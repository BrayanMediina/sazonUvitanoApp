import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import MesaStatusBadge from './components/MesaStatusBadge'
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatus'
import { tablesService, ordersService } from '../../services/api'
import { useAppStore, type AppStore } from '../../store'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelative } from '../../utils/formatDate'

const ACTIVE_STATUSES = ['tomado', 'en_preparacion', 'listo', 'entregado'] as const
type ActiveStatus = typeof ACTIVE_STATUSES[number]

export default function MesaDetallePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user     = useAppStore((s) => s.user)

  // ── Mesa ─────────────────────────────────────────────────────
  // Zustand (actualizado en tiempo real por socket TABLE_UPDATED)
  const storeTable = useAppStore((s) => (s as AppStore).tables.find((t) => t.id === id))

  const { data: apiTable, isLoading: loadingMesa } = useQuery({
    queryKey: ['tables', id],
    queryFn: () => tablesService.getById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchInterval: 30_000,
  })

  // Sembrar la mesa en el store para que los eventos de socket la actualicen
  useEffect(() => {
    if (!apiTable) return
    const tables = useAppStore.getState().tables
    if (!tables.some((t) => t.id === apiTable.id)) {
      useAppStore.getState().setTables([apiTable, ...tables])
    }
  }, [apiTable])

  // Preferir el dato en tiempo real del store; caer al dato de API si no está
  const mesa = storeTable ?? apiTable

  // ── Pedido activo ─────────────────────────────────────────────
  const activeOrderId = mesa?.currentOrderId

  // Buscar en el store primero (actualizado por socket ORDER_UPDATED, emitToAll)
  const storeOrder = useAppStore((s) =>
    (s as AppStore).orders.find((o) => o.id === activeOrderId),
  )

  // Si no está en el store, buscar por ID — GET /api/orders/:id es accesible a mesero
  const { data: apiOrder, isLoading: loadingPedido } = useQuery({
    queryKey: ['orders', activeOrderId],
    queryFn: () => ordersService.getById(activeOrderId!),
    enabled: !!activeOrderId && !storeOrder,
    refetchOnWindowFocus: false,
    refetchInterval: 20_000,
  })

  // Sembrar el pedido en el store para que ORDER_UPDATED lo actualice en tiempo real
  useEffect(() => {
    if (!apiOrder) return
    const orders = useAppStore.getState().orders
    if (!orders.some((o) => o.id === apiOrder.id)) {
      useAppStore.getState().setOrders([apiOrder, ...orders])
    }
  }, [apiOrder])

  const rawOrder = storeOrder ?? apiOrder
  // Solo mostrar si el estado es "activo"
  const pedido = rawOrder && (ACTIVE_STATUSES as readonly string[]).includes(rawOrder.status)
    ? rawOrder as typeof rawOrder & { status: ActiveStatus }
    : undefined

  // ── Permisos ──────────────────────────────────────────────────
  const canNewOrder  = ['mesero', 'administrador'].includes(user?.role ?? '')
  const canEditOrder = ['mesero', 'administrador'].includes(user?.role ?? '')
  const canPayOrder  = ['cajero', 'administrador'].includes(user?.role ?? '')
  const statusCfg    = pedido ? ORDER_STATUS_CONFIG[pedido.status] : null

  if (loadingMesa) {
    return <Layout showBack title="Mesa"><div className="flex justify-center p-12"><Spinner /></div></Layout>
  }
  if (!mesa) {
    return <Layout showBack title="Mesa"><p className="p-6 text-stone-400">Mesa no encontrada</p></Layout>
  }

  return (
    <Layout showBack title={`Mesa ${mesa.number}`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-stone-900 font-heading">Mesa {mesa.number}</h1>
            {mesa.zone && <p className="text-sm text-stone-400">{mesa.zone}</p>}
          </div>
          <MesaStatusBadge status={mesa.status} />
        </div>
        {mesa.capacity && (
          <p className="text-sm text-stone-400 mt-1">Capacidad: {mesa.capacity} personas</p>
        )}
      </div>

      {/* Contenido principal */}
      <div className="px-5 pb-6 space-y-4">
        {loadingPedido && !pedido ? (
          <div className="flex justify-center py-8"><Spinner size="sm" /></div>
        ) : pedido ? (
          /* ── Pedido activo ── */
          <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-4">
            {/* Cabecera del pedido */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-stone-800">Pedido activo</p>
                <p className="text-xs text-stone-400 mt-0.5">{formatRelative(pedido.createdAt)}</p>
              </div>
              {statusCfg && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color} ${statusCfg.textColor}`}>
                  {statusCfg.label}
                </span>
              )}
            </div>

            {/* Ítems (máx 4 visibles) */}
            <div className="space-y-2">
              {pedido.items.slice(0, 4).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-700">{item.quantity}× {item.product.name}</span>
                  <span className="text-stone-500 shrink-0 ml-2">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              {pedido.items.length > 4 && (
                <p className="text-xs text-stone-400">+{pedido.items.length - 4} productos más…</p>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <p className="text-sm font-semibold text-stone-800">Total</p>
              <p className="text-base font-bold text-brand-900">{formatCurrency(pedido.total)}</p>
            </div>

            {/* Acciones */}
            <div className={`grid gap-2 ${canEditOrder && pedido.status === 'tomado' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <Button variant="outline" size="sm" onClick={() => navigate(`/pedidos/${pedido.id}`)}>
                Ver detalle
              </Button>
              {canEditOrder && pedido.status === 'tomado' && (
                <Button size="sm" onClick={() => navigate(`/pedidos/${pedido.id}?editar=1`)}>
                  ✏️ Editar pedido
                </Button>
              )}
            </div>

            {canPayOrder && pedido.status === 'entregado' && (
              <Button fullWidth size="md" onClick={() => navigate('/caja')}>
                💳 Procesar pago
              </Button>
            )}
          </div>
        ) : (
          /* ── Mesa sin pedido activo ── */
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center">
            <p className="text-3xl mb-2">🪑</p>
            <p className="text-sm font-medium text-stone-600">Mesa disponible</p>
            <p className="text-xs text-stone-400 mt-1">Sin pedido activo</p>
          </div>
        )}

        {/* Botón nuevo pedido — solo si no hay pedido activo */}
        {canNewOrder && !pedido && (
          <Button fullWidth size="lg" onClick={() => navigate(`/pedidos/nuevo?mesa=${mesa.id}`)}>
            + Nuevo pedido
          </Button>
        )}
      </div>
    </Layout>
  )
}

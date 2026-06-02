import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import Spinner from '../../components/ui/Spinner'
import Button from '../../components/ui/Button'
import MesaStatusBadge from './components/MesaStatusBadge'
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatus'
import { tablesService, ordersService } from '../../services/api'
import { useAppStore } from '../../store'
import { formatCurrency } from '../../utils/formatCurrency'

export default function MesaDetallePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user     = useAppStore((s) => s.user)

  const { data: mesa, isLoading: loadingMesa } = useQuery({
    queryKey: ['tables', id],
    queryFn: () => tablesService.getById(id!),
    enabled: !!id,
  })

  const { data: pedido, isLoading: loadingPedido } = useQuery({
    queryKey: ['orders', 'table', id],
    queryFn: () => ordersService.getAll({ tableId: id! }),
    select: (data) => data.find((o) => ['tomado','en_preparacion','listo','entregado'].includes(o.status)),
    enabled: !!id,
  })

  if (loadingMesa) return <Layout showBack title="Mesa"><div className="flex justify-center p-12"><Spinner /></div></Layout>
  if (!mesa) return <Layout showBack title="Mesa"><p className="p-6 text-stone-400">Mesa no encontrada</p></Layout>

  const statusCfg = pedido ? ORDER_STATUS_CONFIG[pedido.status] : null
  const canNewOrder   = ['mesero','administrador'].includes(user?.role ?? '')
  const canPayOrder   = ['cajero','administrador'].includes(user?.role ?? '')

  return (
    <Layout showBack title={`Mesa ${mesa.number}`}>
      {/* Header de mesa */}
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

      {/* Pedido activo */}
      <div className="px-5">
        {loadingPedido ? (
          <div className="flex justify-center py-8"><Spinner size="sm" /></div>
        ) : pedido ? (
          <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-stone-800">Pedido activo</p>
              {statusCfg && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color} ${statusCfg.textColor}`}>
                  {statusCfg.label}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {pedido.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-stone-700">{item.quantity}× {item.product.name}</span>
                  <span className="text-stone-500">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              {pedido.items.length > 3 && (
                <p className="text-xs text-stone-400">+{pedido.items.length - 3} más…</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <p className="text-sm font-semibold text-stone-800">Total</p>
              <p className="text-base font-bold text-brand-900">{formatCurrency(pedido.total)}</p>
            </div>

            <div className={`grid gap-2 ${canNewOrder && pedido.status === 'tomado' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pedidos/${pedido.id}`)}
              >
                Ver detalle
              </Button>
              {canNewOrder && pedido.status === 'tomado' && (
                <Button
                  size="sm"
                  onClick={() => navigate(`/pedidos/${pedido.id}?editar=1`)}
                >
                  ✏️ Editar
                </Button>
              )}
            </div>

            {canPayOrder && pedido.status === 'entregado' && (
              <Button fullWidth size="md" onClick={() => navigate(`/caja`)}>
                Procesar pago
              </Button>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-stone-200 rounded-2xl p-8 text-center">
            <p className="text-2xl mb-2">🪑</p>
            <p className="text-sm text-stone-500">Mesa disponible</p>
            <p className="text-xs text-stone-400">Sin pedido activo</p>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-4 space-y-3">
          {canNewOrder && !pedido && (
            <Button
              fullWidth
              size="lg"
              onClick={() => navigate(`/pedidos/nuevo?mesa=${mesa.id}`)}
            >
              + Nuevo pedido
            </Button>
          )}
        </div>
      </div>
    </Layout>
  )
}

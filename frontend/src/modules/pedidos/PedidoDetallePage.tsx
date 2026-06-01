import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import OrderStatusStepper from './components/OrderStatusStepper'
import OrderItemRow from './components/OrderItemRow'
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatus'
import { ordersService } from '../../services/api'
import { useAppStore } from '../../store'
import { useOrder } from '../../hooks/useOrders'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelative } from '../../utils/formatDate'

export default function PedidoDetallePage() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user     = useAppStore((s) => s.user)
  const qc       = useQueryClient()

  const { data: pedido, isLoading } = useOrder(id!)

  const { mutate: advanceStatus, isPending } = useMutation({
    mutationFn: (status: string) => ordersService.updateStatus(id!, status as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
  })

  if (isLoading) return <Layout showBack title="Pedido"><div className="flex justify-center p-12"><Spinner /></div></Layout>
  if (!pedido)   return <Layout showBack title="Pedido"><p className="p-6 text-stone-400">Pedido no encontrado</p></Layout>

  const statusCfg = ORDER_STATUS_CONFIG[pedido.status]
  const nextStatus = statusCfg.next
  const canAdvance  = ['cajero','administrador'].includes(user?.role ?? '') && !!nextStatus
  const canPay      = canAdvance && pedido.status === 'entregado'

  return (
    <Layout showBack title="Pedido">
      <div className="px-5 pt-5 pb-6 space-y-5">
        {/* Estado del pedido */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400">
                {pedido.type === 'mesa' && pedido.table ? `Mesa ${pedido.table.number}` : 'Domicilio'}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">{formatRelative(pedido.createdAt)}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color} ${statusCfg.textColor}`}>
              {statusCfg.label}
            </span>
          </div>
          <OrderStatusStepper status={pedido.status} />
        </div>

        {/* Ítems */}
        <div className="bg-white border border-stone-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-stone-800 mb-3">Productos</p>
          {pedido.items.map((item) => (
            <OrderItemRow
              key={item.id}
              product={item.product}
              qty={item.quantity}
              notes={item.notes}
              readonly
            />
          ))}
          {pedido.notes && (
            <p className="text-xs text-stone-400 mt-3 pt-3 border-t border-stone-100">
              📝 {pedido.notes}
            </p>
          )}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
            <p className="font-semibold text-stone-800">Total</p>
            <p className="text-lg font-bold text-brand-900">{formatCurrency(pedido.total)}</p>
          </div>
        </div>

        {/* Acciones */}
        {canAdvance && nextStatus && !canPay && (
          <Button
            fullWidth
            size="lg"
            isLoading={isPending}
            onClick={() => advanceStatus(nextStatus)}
          >
            Avanzar a {ORDER_STATUS_CONFIG[nextStatus].label}
          </Button>
        )}
        {canPay && (
          <Button fullWidth size="lg" onClick={() => navigate('/caja')}>
            💳 Procesar pago
          </Button>
        )}
      </div>
    </Layout>
  )
}

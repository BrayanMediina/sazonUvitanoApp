import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import OrderStatusStepper from './components/OrderStatusStepper'
import OrderItemRow from './components/OrderItemRow'
import EditarPedidoSheet from './components/EditarPedidoSheet'
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatus'
import { ordersService } from '../../services/api'
import { useAppStore } from '../../store'
import { useOrder } from '../../hooks/useOrders'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelative } from '../../utils/formatDate'

export default function PedidoDetallePage() {
  const { id }         = useParams<{ id: string }>()
  const navigate       = useNavigate()
  const [params]       = useSearchParams()
  const user           = useAppStore((s) => s.user)
  const qc             = useQueryClient()

  const [editOpen, setEditOpen] = useState(false)

  // Abrir editor automáticamente si viene de ?editar=1
  useEffect(() => {
    if (params.get('editar') === '1') setEditOpen(true)
  }, [params])

  const { data: pedido, isLoading } = useOrder(id!)

  const { mutate: advanceStatus, isPending } = useMutation({
    mutationFn: (status: string) => ordersService.updateStatus(id!, status as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
  })

  if (isLoading) return <Layout showBack title="Pedido"><div className="flex justify-center p-12"><Spinner /></div></Layout>
  if (!pedido)   return <Layout showBack title="Pedido"><p className="p-6 text-stone-400">Pedido no encontrado</p></Layout>

  const statusCfg = ORDER_STATUS_CONFIG[pedido.status]
  const nextStatus = statusCfg.next
  const canAdvance = ['cajero','administrador'].includes(user?.role ?? '') && !!nextStatus
  const canPay     = canAdvance && pedido.status === 'entregado'

  // Solo mesero y admin pueden editar, y solo mientras el pedido está en "tomado"
  const canEdit = ['mesero','administrador'].includes(user?.role ?? '') && pedido.status === 'tomado'

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
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-stone-800">Productos</p>
            {canEdit && (
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl active:bg-brand-100 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            )}
          </div>

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

        {/* Acciones de estado */}
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

      {/* Editor de pedido */}
      {canEdit && (
        <EditarPedidoSheet
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          pedido={pedido}
        />
      )}
    </Layout>
  )
}

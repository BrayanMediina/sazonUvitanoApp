import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ORDER_STATUS_CONFIG } from '../../../constants/orderStatus'
import { ordersService } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatRelative } from '../../../utils/formatDate'
import type { Order } from '../../../types'

interface PedidoCobroCardProps {
  order: Order
  onCobrar: () => void
}

export default function PedidoCobroCard({ order, onCobrar }: PedidoCobroCardProps) {
  const qc = useQueryClient()
  const statusCfg = ORDER_STATUS_CONFIG[order.status]
  const nextStatus = statusCfg.next

  const { mutate: advance, isPending } = useMutation({
    mutationFn: () => ordersService.updateStatus(order.id, nextStatus!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }) },
  })

  const label = order.type === 'mesa' && order.table
    ? `Mesa ${order.table.number}`
    : 'Domicilio'

  const preview = order.items.slice(0, 3).map((i) => i.product.name).join(', ')
  const extra   = order.items.length > 3 ? ` +${order.items.length - 3} más` : ''

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-stone-800">{label}</p>
          <p className="text-xs text-stone-400 mt-0.5">{formatRelative(order.createdAt)}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${statusCfg.color} ${statusCfg.textColor}`}>
          {statusCfg.label}
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed">
        {preview}{extra}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-brand-900">{formatCurrency(order.total)}</p>
        <div className="flex gap-2">
          {nextStatus && order.status !== 'entregado' && (
            <button
              onClick={() => advance()}
              disabled={isPending}
              className="px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold active:scale-95 disabled:opacity-50"
            >
              → {ORDER_STATUS_CONFIG[nextStatus].label}
            </button>
          )}
          {order.status === 'entregado' && (
            <button
              onClick={onCobrar}
              className="px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-semibold active:scale-95"
            >
              💳 Cobrar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

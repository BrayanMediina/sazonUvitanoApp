import { ORDER_STATUS_CONFIG } from '../../../constants/orderStatus'
import type { OrderStatus } from '../../../types'

const FLOW: OrderStatus[] = ['tomado', 'en_preparacion', 'listo', 'entregado', 'pagado', 'finalizado']

export default function OrderStatusStepper({ status }: { status: OrderStatus }) {
  const currentIdx = FLOW.indexOf(status)
  if (status === 'cancelado') return (
    <div className="flex items-center gap-2 bg-red-50 rounded-xl p-3">
      <span className="text-red-500">❌</span>
      <span className="text-sm font-semibold text-red-700">Pedido cancelado</span>
    </div>
  )

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
      {FLOW.map((step, idx) => {
        const cfg    = ORDER_STATUS_CONFIG[step]
        const active = idx <= currentIdx
        return (
          <div key={step} className="flex items-center shrink-0">
            <div className={`flex flex-col items-center gap-1 ${active ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`h-2 w-2 rounded-full ${active ? 'bg-brand-900' : 'bg-stone-300'}`} />
              <span className={`text-[9px] font-medium ${active ? 'text-brand-900' : 'text-stone-400'} whitespace-nowrap`}>
                {cfg.label}
              </span>
            </div>
            {idx < FLOW.length - 1 && (
              <div className={`w-5 h-px mb-3 mx-0.5 ${idx < currentIdx ? 'bg-brand-900' : 'bg-stone-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

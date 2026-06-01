import DomicilioStatusBadge from './DomicilioStatusBadge'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Delivery } from '../../../types'

interface DomicilioCardProps {
  delivery: Delivery
  onAsignar?: () => void
}

export default function DomicilioCard({ delivery, onAsignar }: DomicilioCardProps) {

  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-stone-800">{delivery.customerName}</p>
          <p className="text-xs text-stone-400 mt-0.5">📞 {delivery.customerPhone}</p>
        </div>
        <DomicilioStatusBadge status={delivery.status} />
      </div>

      <div className="text-xs text-stone-600">
        <p>📍 {delivery.address.street}</p>
        {delivery.address.neighborhood && <p className="text-stone-400">{delivery.address.neighborhood}</p>}
        {delivery.address.reference && <p className="text-stone-400 italic">{delivery.address.reference}</p>}
      </div>

      {delivery.driver && (
        <p className="text-xs text-stone-500">🛵 {delivery.driver.name}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="font-bold text-brand-900">{formatCurrency(delivery.order.total)}</p>
        <div className="flex gap-2">
          {delivery.status === 'pendiente' && onAsignar && (
            <Button size="sm" onClick={onAsignar}>Asignar</Button>
          )}
        </div>
      </div>
    </div>
  )
}

import { DELIVERY_STATUS_CONFIG } from '../../../constants/orderStatus'
import type { DeliveryStatus } from '../../../types'

export default function DomicilioStatusBadge({ status }: { status: DeliveryStatus }) {
  const cfg = DELIVERY_STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.textColor}`}>
      {cfg.icon} {cfg.label}
    </span>
  )
}

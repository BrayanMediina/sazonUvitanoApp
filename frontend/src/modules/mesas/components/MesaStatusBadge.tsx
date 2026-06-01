import { TABLE_STATUS_CONFIG } from '../../../constants/orderStatus'
import type { TableStatus } from '../../../types'

export default function MesaStatusBadge({ status }: { status: TableStatus }) {
  const cfg = TABLE_STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.textColor}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
      {cfg.label}
    </span>
  )
}

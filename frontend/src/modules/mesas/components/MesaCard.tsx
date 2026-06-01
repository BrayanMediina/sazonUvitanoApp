import { useNavigate } from 'react-router-dom'
import { TABLE_STATUS_CONFIG } from '../../../constants/orderStatus'
import type { Table } from '../../../types'

interface MesaCardProps { mesa: Table }

export default function MesaCard({ mesa }: MesaCardProps) {
  const navigate = useNavigate()
  const cfg = TABLE_STATUS_CONFIG[mesa.status]

  return (
    <button
      onClick={() => navigate(`/mesas/${mesa.id}`)}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-95 ${cfg.color} border-transparent hover:border-current`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-lg font-bold font-heading ${cfg.textColor}`}>Mesa {mesa.number}</span>
        <span className={`h-2.5 w-2.5 rounded-full mt-1 ${cfg.dotColor}`} />
      </div>
      {mesa.zone && <p className="text-xs text-stone-500 mb-1">{mesa.zone}</p>}
      {mesa.capacity && (
        <p className={`text-xs font-medium ${cfg.textColor} opacity-70`}>
          {mesa.capacity} personas
        </p>
      )}
      <p className={`text-xs font-semibold mt-2 ${cfg.textColor}`}>{cfg.label}</p>
    </button>
  )
}

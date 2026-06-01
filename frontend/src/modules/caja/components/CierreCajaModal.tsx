import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { DailySummary } from '../../../types'

interface CierreCajaModalProps {
  isOpen: boolean
  onClose: () => void
  summary: DailySummary | null
}

export default function CierreCajaModal({ isOpen, onClose, summary }: CierreCajaModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cierre del día" footer={
      <Button fullWidth onClick={onClose}>Aceptar</Button>
    }>
      {summary ? (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-xs text-green-700 mb-1">Ingresos totales del día</p>
            <p className="text-3xl font-bold text-green-800 font-heading">
              {formatCurrency(summary.totalRevenue)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-stone-800">{summary.totalOrders}</p>
              <p className="text-[10px] text-stone-400">Pedidos</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-stone-800">{summary.totalDeliveries}</p>
              <p className="text-[10px] text-stone-400">Domicilios</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-stone-800">{formatCurrency(summary.averageTicket)}</p>
              <p className="text-[10px] text-stone-400">Ticket prom.</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-stone-400 py-6">Sin datos del día</p>
      )}
    </Modal>
  )
}

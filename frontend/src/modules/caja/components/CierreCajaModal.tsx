import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/formatCurrency'
import { reportsService } from '../../../services/api'
import type { DailySummary } from '../../../types'

interface CierreCajaModalProps {
  isOpen: boolean
  onClose: () => void
  summary: DailySummary | null
}

export default function CierreCajaModal({ isOpen, onClose, summary }: CierreCajaModalProps) {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [done, setDone] = useState(false)

  const { mutate: confirmarCierre, isPending } = useMutation({
    mutationFn: () => reportsService.closeDia(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['daily-summary'] })
      qc.invalidateQueries({ queryKey: ['reports'] })
      setDone(true)
    },
  })

  const handleClose = () => {
    setDone(false)
    onClose()
  }

  const handleVerReporte = () => {
    handleClose()
    navigate('/reportes')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cierre del día"
      footer={
        done ? (
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={handleClose}>Cerrar</Button>
            <Button fullWidth onClick={handleVerReporte}>Ver reporte</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={handleClose}>Cancelar</Button>
            <Button
              fullWidth
              isLoading={isPending}
              disabled={isPending || !summary}
              onClick={() => confirmarCierre()}
            >
              Confirmar cierre
            </Button>
          </div>
        )
      }
    >
      {done ? (
        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-5xl">✅</span>
            <p className="text-base font-semibold text-stone-800">Cierre registrado</p>
            <p className="text-sm text-stone-500">El resumen del día ha sido guardado en los reportes automáticamente.</p>
          </div>
        </div>
      ) : summary ? (
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
          <p className="text-xs text-center text-stone-400 px-2">
            Al confirmar el cierre, el resumen quedará registrado y podrá consultarse en los reportes.
          </p>
        </div>
      ) : (
        <p className="text-center text-stone-400 py-6">Sin datos del día</p>
      )}
    </Modal>
  )
}

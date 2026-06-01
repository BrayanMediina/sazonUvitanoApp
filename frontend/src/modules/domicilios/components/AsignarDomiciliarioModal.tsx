import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import { useDrivers } from '../../../hooks/useUsers'
import { deliveriesService } from '../../../services/api'

interface AsignarDomiciliarioModalProps {
  deliveryId: string | null
  onClose: () => void
}

export default function AsignarDomiciliarioModal({ deliveryId, onClose }: AsignarDomiciliarioModalProps) {
  const [selectedDriver, setSelectedDriver] = useState('')
  const { data: drivers = [] } = useDrivers()
  const qc = useQueryClient()

  const { mutate: assign, isPending } = useMutation({
    mutationFn: () => deliveriesService.assign(deliveryId!, selectedDriver),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] })
      onClose()
    },
  })

  return (
    <Modal
      isOpen={!!deliveryId}
      onClose={onClose}
      title="Asignar domiciliario"
      footer={
        <Button fullWidth isLoading={isPending} disabled={!selectedDriver} onClick={() => assign()}>
          Asignar
        </Button>
      }
    >
      <div className="space-y-3">
        {drivers.length === 0 ? (
          <p className="text-center text-stone-400 py-4 text-sm">No hay domiciliarios disponibles</p>
        ) : (
          drivers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriver(d.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-95 ${
                selectedDriver === d.id ? 'border-brand-900 bg-brand-50' : 'border-stone-200'
              }`}
            >
              <div className="h-9 w-9 bg-brand-100 rounded-full flex items-center justify-center font-bold text-brand-900 text-sm shrink-0">
                {d.name.charAt(0)}
              </div>
              <p className={`text-sm font-semibold ${selectedDriver === d.id ? 'text-brand-900' : 'text-stone-700'}`}>
                {d.name}
              </p>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import { useDrivers } from '../../../hooks/useUsers'
import { deliveriesService } from '../../../services/api'

interface AsignarDomiciliarioModalProps {
  deliveryId: string | null
  onClose: () => void
}

export default function AsignarDomiciliarioModal({ deliveryId, onClose }: AsignarDomiciliarioModalProps) {
  const [selectedDriver, setSelectedDriver] = useState('')
  const { data: drivers = [], isLoading } = useDrivers()
  const qc = useQueryClient()

  const { mutate: assign, isPending } = useMutation({
    mutationFn: () => deliveriesService.assign(deliveryId!, selectedDriver),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['deliveries'] })
      setSelectedDriver('')
      onClose()
    },
  })

  return (
    <Modal
      isOpen={!!deliveryId}
      onClose={() => { setSelectedDriver(''); onClose() }}
      title="Asignar domiciliario"
      footer={
        <Button fullWidth isLoading={isPending} disabled={!selectedDriver || isPending} onClick={() => assign()}>
          Asignar entrega
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-6"><Spinner size="sm" /></div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <p className="text-2xl">🛵</p>
          <p className="text-sm font-medium text-stone-600">Sin domiciliarios activos</p>
          <p className="text-xs text-stone-400">Registra un domiciliario en el panel de administración</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drivers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriver(d.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-95 ${
                selectedDriver === d.id
                  ? 'border-brand-900 bg-brand-50'
                  : 'border-stone-200 bg-white'
              }`}
            >
              {/* Avatar inicial */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                selectedDriver === d.id ? 'bg-brand-900 text-white' : 'bg-brand-100 text-brand-900'
              }`}>
                {d.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm font-semibold truncate ${selectedDriver === d.id ? 'text-brand-900' : 'text-stone-700'}`}>
                  {d.name}
                </p>
                {d.phone && (
                  <p className="text-xs text-stone-400 truncate">{d.phone}</p>
                )}
              </div>

              {selectedDriver === d.id && (
                <svg className="h-5 w-5 text-brand-900 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}

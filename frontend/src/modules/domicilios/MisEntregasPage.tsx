import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import DomicilioStatusBadge from './components/DomicilioStatusBadge'
import { useMyDeliveries } from '../../hooks/useDeliveries'
import { deliveriesService } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

export default function MisEntregasPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: deliveries = [], isLoading } = useMyDeliveries()

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'en_camino' | 'entregado' }) =>
      deliveriesService.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['deliveries', 'my'] }) },
  })

  const activas    = deliveries.filter((d) => ['asignado','en_camino'].includes(d.status))
  const historial  = deliveries.filter((d) => ['entregado','cancelado'].includes(d.status)).slice(0, 10)

  return (
    <Layout title="Mis entregas">
      <PageHeader title="Mis entregas" />

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {/* Activas */}
      {activas.length > 0 && (
        <div className="px-5 mb-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Activas</p>
          <div className="space-y-4">
            {activas.map((d) => (
              <div key={d.id} className="bg-white border-2 border-amber-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-stone-800">{d.customerName}</p>
                    <p className="text-xs text-stone-400 mt-0.5">📍 {d.address.street}</p>
                    {d.address.reference && <p className="text-xs text-stone-400 italic">{d.address.reference}</p>}
                  </div>
                  <DomicilioStatusBadge status={d.status} />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-brand-900">{formatCurrency(d.order.total)}</span>
                  <a href={`tel:${d.customerPhone}`} className="text-brand-700 text-xs font-medium">
                    📞 Llamar
                  </a>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/mapa')}
                  >
                    🗺️ Navegar
                  </Button>
                  {d.status === 'asignado' && (
                    <Button
                      size="sm"
                      className="flex-1"
                      isLoading={isPending}
                      onClick={() => updateStatus({ id: d.id, status: 'en_camino' })}
                    >
                      Salir a entregar
                    </Button>
                  )}
                  {d.status === 'en_camino' && (
                    <Button
                      size="sm"
                      className="flex-1"
                      isLoading={isPending}
                      onClick={() => updateStatus({ id: d.id, status: 'entregado' })}
                    >
                      ✅ Entregado
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activas.length === 0 && !isLoading && (
        <div className="px-5 mb-6">
          <EmptyState icon="🛵" title="Sin entregas activas" description="No tienes entregas asignadas en este momento" />
        </div>
      )}

      {/* Historial */}
      {historial.length > 0 && (
        <div className="px-5">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Historial reciente</p>
          <div className="space-y-2">
            {historial.map((d) => (
              <div key={d.id} className="bg-white border border-stone-100 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-700">{d.customerName}</p>
                  <p className="text-xs text-stone-400">{d.address.street}</p>
                </div>
                <div className="text-right">
                  <DomicilioStatusBadge status={d.status} />
                  <p className="text-xs text-stone-400 mt-1">{formatCurrency(d.order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  )
}

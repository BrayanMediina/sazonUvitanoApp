import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import DomicilioCard from './components/DomicilioCard'
import AsignarDomiciliarioModal from './components/AsignarDomiciliarioModal'
import { useDeliveries } from '../../hooks/useDeliveries'
import { useAppStore, type AppStore } from '../../store'
import type { DeliveryStatus } from '../../types'

const FILTERS: { label: string; value: DeliveryStatus | 'all' }[] = [
  { label: 'Todos',      value: 'all' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Asignados',  value: 'asignado' },
  { label: 'En camino',  value: 'en_camino' },
  { label: 'Entregados', value: 'entregado' },
]

export default function DomiciliosPage() {
  const navigate = useNavigate()
  const [filter, setFilter]   = useState<DeliveryStatus | 'all'>('all')
  const [asignando, setAsignando] = useState<string | null>(null)

  const { isLoading } = useDeliveries()
  const rawDeliveries = useAppStore((s) => (s as AppStore).deliveries)
  const deliveries = rawDeliveries as import('../../types').Delivery[]

  const pendientes = deliveries.filter((d) => d.status === 'pendiente').length
  const enCamino   = deliveries.filter((d) => d.status === 'en_camino').length
  const filtered   = filter === 'all' ? deliveries : deliveries.filter((d) => d.status === filter)

  return (
    <Layout title="Domicilios">
      <PageHeader
        title="Domicilios"
        actions={
          <Button size="sm" onClick={() => navigate('/domicilios/nuevo')}>
            + Nuevo
          </Button>
        }
      />

      {/* Stats rápidos */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-4">
        <div className="bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-amber-800">{pendientes}</p>
          <p className="text-xs text-amber-700">Pendientes</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-orange-800">{enCamino}</p>
          <p className="text-xs text-orange-700">En camino</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                filter === f.value ? 'bg-brand-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-5 space-y-3 pb-6">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && filtered.length === 0 && (
          <EmptyState icon="🛵" title="Sin domicilios" description="No hay domicilios en este estado" />
        )}
        {!isLoading && filtered.map((d) => (
          <DomicilioCard key={d.id} delivery={d} onAsignar={() => setAsignando(d.id)} />
        ))}
      </div>

      <AsignarDomiciliarioModal deliveryId={asignando} onClose={() => setAsignando(null)} />
    </Layout>
  )
}

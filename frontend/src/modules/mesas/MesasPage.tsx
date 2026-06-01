import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import MesaCard from './components/MesaCard'
import { useTables } from '../../hooks/useTables'
import { useAppStore, type AppStore } from '../../store'
import { TABLE_STATUS_CONFIG } from '../../constants/orderStatus'
import type { TableStatus } from '../../types'

const FILTERS: { label: string; value: TableStatus | 'all' }[] = [
  { label: 'Todas',        value: 'all' },
  { label: 'Disponibles',  value: 'disponible' },
  { label: 'Ocupadas',     value: 'ocupada' },
  { label: 'Por cobrar',   value: 'pendiente_pago' },
]

export default function MesasPage() {
  const [filter, setFilter] = useState<TableStatus | 'all'>('all')
  const { isLoading, isError, refetch } = useTables()
  const rawTables = useAppStore((s) => (s as AppStore).tables)
  const tables = rawTables as import('../../types').Table[]

  const disponibles    = tables.filter((t) => t.status === 'disponible').length
  const ocupadas       = tables.filter((t) => t.status === 'ocupada').length
  const porCobrar      = tables.filter((t) => t.status === 'pendiente_pago').length

  const filtered = filter === 'all' ? tables : tables.filter((t) => t.status === filter)

  return (
    <Layout title="Mesas">
      <PageHeader
        title="Mesas"
        subtitle={`${tables.length} mesas configuradas`}
      />

      {/* Stats rápidos */}
      <div className="px-5 grid grid-cols-3 gap-2 mb-4">
        {[
          { label: 'Disponibles', count: disponibles, color: 'bg-green-50 text-green-700' },
          { label: 'Ocupadas',    count: ocupadas,    color: 'bg-orange-50 text-orange-700' },
          { label: 'Por cobrar',  count: porCobrar,   color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
            <p className="text-xl font-bold font-heading">{s.count}</p>
            <p className="text-[10px] font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros horizontales */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                filter === f.value
                  ? 'bg-brand-900 text-white'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de mesas */}
      <div className="px-5">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}
        {isError && (
          <EmptyState
            icon="⚠️"
            title="Error al cargar mesas"
            description="No se pudo conectar con el servidor"
            action={<button onClick={() => refetch()} className="text-sm text-brand-700 font-medium">Reintentar</button>}
          />
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            icon="🪑"
            title="Sin mesas"
            description={filter === 'all' ? 'No hay mesas configuradas' : `No hay mesas ${TABLE_STATUS_CONFIG[filter as TableStatus]?.label.toLowerCase()}`}
          />
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((mesa) => (
              <MesaCard key={mesa.id} mesa={mesa} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

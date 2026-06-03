import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import PedidoCobroCard from './components/PedidoCobroCard'
import CobroModal from './components/CobroModal'
import CierreCajaModal from './components/CierreCajaModal'
import EditarPedidoSheet from '../pedidos/components/EditarPedidoSheet'
import { ordersService, paymentsService } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'
import { todayStr } from '../../utils/formatDate'
import type { Order, OrderStatus } from '../../types'

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Todos',          value: 'all' },
  { label: 'Tomados',        value: 'tomado' },
  { label: 'En preparación', value: 'en_preparacion' },
  { label: 'Listos',         value: 'listo' },
  { label: 'Entregados',     value: 'entregado' },
]

export default function CajaPage() {
  const [filter, setFilter]          = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelected]  = useState<Order | null>(null)
  const [editingOrder, setEditing]    = useState<Order | null>(null)
  const [showCierre, setShowCierre]   = useState(false)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'caja'],
    queryFn: () => ordersService.getAll(),
    refetchInterval: 15_000,
    select: (data) => data.filter((o) => !['finalizado','cancelado'].includes(o.status)),
  })

  const { data: summary = null } = useQuery({
    queryKey: ['daily-summary'],
    queryFn: () => paymentsService.getDailyReport(todayStr()),
  })

  const ingresos = summary?.totalRevenue ?? 0
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  // Always use the freshest order data from the query for the cobro modal
  const liveSelected = selectedOrder
    ? (orders.find((o) => o.id === selectedOrder.id) ?? selectedOrder)
    : null

  return (
    <Layout title="Caja">
      <PageHeader
        title="Caja"
        actions={
          <Button size="sm" variant="outline" onClick={() => setShowCierre(true)}>
            Cierre del día
          </Button>
        }
      />

      {/* Resumen ingresos */}
      <div className="mx-5 bg-brand-900 rounded-2xl p-4 mb-4">
        <p className="text-brand-200 text-xs mb-1">Ingresos del día</p>
        <p className="text-white text-2xl font-bold font-heading">{formatCurrency(ingresos)}</p>
      </div>

      {/* Filtros */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                filter === f.value ? 'bg-brand-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="ml-1 opacity-60">
                  ({orders.filter((o) => o.status === f.value).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="px-5 space-y-3 pb-6">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && filtered.length === 0 && (
          <EmptyState icon="🧾" title="Sin pedidos activos" description="No hay pedidos en este estado" />
        )}
        {!isLoading && filtered.map((order) => (
          <PedidoCobroCard
            key={order.id}
            order={order}
            onCobrar={() => setSelected(order)}
          />
        ))}
      </div>

      <CobroModal
        order={liveSelected}
        onClose={() => setSelected(null)}
        onEdit={() => {
          setEditing(liveSelected)
          setSelected(null)
        }}
      />
      {editingOrder && (
        <EditarPedidoSheet
          isOpen={!!editingOrder}
          onClose={() => {
            setEditing(null)
            // Re-open cobro modal with same order after edit
            setSelected(editingOrder)
          }}
          pedido={editingOrder}
        />
      )}
      <CierreCajaModal isOpen={showCierre} onClose={() => setShowCierre(false)} summary={summary} />
    </Layout>
  )
}

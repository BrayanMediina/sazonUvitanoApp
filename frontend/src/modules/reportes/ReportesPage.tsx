import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'
import Spinner from '../../components/ui/Spinner'
import { reportsService } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'
import { todayStr } from '../../utils/formatDate'
import { PAYMENT_METHOD_CONFIG, ORDER_STATUS_CONFIG, CATEGORY_CONFIG } from '../../constants/orderStatus'

export default function ReportesPage() {
  const [date, setDate] = useState(todayStr())

  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', 'daily', date],
    queryFn: () => reportsService.getDaily(date),
  })

  return (
    <Layout title="Reportes">
      <PageHeader title="Reportes" subtitle="Resumen operativo diario" />

      {/* Selector de fecha */}
      <div className="px-5 mb-5">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={todayStr()}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        />
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {report && (
        <div className="px-5 space-y-4 pb-8">
          {/* Métricas principales */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Ingresos',       value: formatCurrency(report.totalRevenue), icon: '💰', bg: 'bg-green-50', text: 'text-green-800' },
              { label: 'Pedidos',        value: report.totalOrders,                  icon: '📋', bg: 'bg-blue-50',  text: 'text-blue-800' },
              { label: 'Domicilios',     value: report.totalDeliveries,              icon: '🛵', bg: 'bg-orange-50',text: 'text-orange-800' },
              { label: 'Ticket promedio',value: formatCurrency(report.averageTicket),icon: '🎯', bg: 'bg-amber-50', text: 'text-amber-800' },
            ].map((m) => (
              <div key={m.label} className={`${m.bg} rounded-2xl p-4`}>
                <p className="text-xl">{m.icon}</p>
                <p className={`text-xl font-bold font-heading ${m.text} mt-1`}>{m.value}</p>
                <p className={`text-xs ${m.text} opacity-70`}>{m.label}</p>
              </div>
            ))}
          </div>

          {/* Métodos de pago */}
          {report.paymentBreakdown && (
            <div className="bg-white border border-stone-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-stone-800 mb-3">Métodos de pago</p>
              <div className="space-y-2">
                {(Object.entries(report.paymentBreakdown) as [string, number][])
                  .filter(([, v]) => v > 0)
                  .map(([method, amount]) => {
                    const cfg = PAYMENT_METHOD_CONFIG[method as keyof typeof PAYMENT_METHOD_CONFIG]
                    const pct = report.totalRevenue > 0 ? (amount / report.totalRevenue) * 100 : 0
                    return (
                      <div key={method}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-1.5 text-stone-700">
                            {cfg?.icon} {cfg?.label ?? method}
                          </span>
                          <span className="font-semibold">{formatCurrency(amount)}</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-700 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* Top productos */}
          {report.topProducts?.length > 0 && (
            <div className="bg-white border border-stone-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-stone-800 mb-3">Top productos</p>
              <div className="space-y-2">
                {report.topProducts.slice(0, 5).map(({ product, quantity }, i) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-400 w-5">#{i + 1}</span>
                    <span className="text-base">{CATEGORY_CONFIG[product.category]?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                    </div>
                    <span className="text-sm font-bold text-brand-900">{quantity} uds.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pedidos por estado */}
          {report.ordersByStatus && (
            <div className="bg-white border border-stone-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-stone-800 mb-3">Pedidos por estado</p>
              <div className="space-y-2">
                {(Object.entries(report.ordersByStatus) as [string, number][])
                  .filter(([, v]) => v > 0)
                  .map(([status, count]) => {
                    const cfg = ORDER_STATUS_CONFIG[status as keyof typeof ORDER_STATUS_CONFIG]
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cfg?.color} ${cfg?.textColor}`}>
                          {cfg?.label ?? status}
                        </span>
                        <span className="text-sm font-bold text-stone-700">{count}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && !report && (
        <div className="flex flex-col items-center py-16 text-center px-6">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm text-stone-500">Sin datos para esta fecha</p>
        </div>
      )}
    </Layout>
  )
}

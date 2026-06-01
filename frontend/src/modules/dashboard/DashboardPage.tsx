import Layout from '../../components/layout/Layout'
import { useAppStore, type AppStore } from '../../store'
import { useSocketInit } from '../../hooks/useSocket'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useGPS } from '../../hooks/useGPS'
import { useTables } from '../../hooks/useTables'
import { useOrders } from '../../hooks/useOrders'
import { useDeliveries } from '../../hooks/useDeliveries'
import { formatCurrency } from '../../utils/formatCurrency'
import { ROLE_CONFIG } from '../../constants/orderStatus'

interface MetricCardProps {
  label: string
  value: string | number
  icon: string
  bgClass: string
  textClass: string
}

function MetricCard({ label, value, icon, bgClass, textClass }: MetricCardProps) {
  return (
    <div className={`${bgClass} rounded-2xl p-4 flex flex-col gap-2`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold font-heading ${textClass}`}>{value}</p>
      <p className={`text-xs font-medium ${textClass} opacity-70`}>{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  useSocketInit()
  useOnlineStatus()
  useGPS()
  useTables()
  useOrders()
  useDeliveries()

  const user     = useAppStore((s) => (s as AppStore).user)
  const tables   = useAppStore((s) => (s as AppStore).tables) as import('../../types').Table[]
  const orders   = useAppStore((s) => (s as AppStore).orders) as import('../../types').Order[]
  const deliveries = useAppStore((s) => (s as AppStore).deliveries) as import('../../types').Delivery[]

  const firstName = user?.name?.split(' ')[0] ?? ''
  const roleCfg   = user ? ROLE_CONFIG[user.role] : null

  const mesasActivas   = tables.filter((t) => t.status !== 'disponible').length
  const pedidosPendientes = orders.filter((o) => ['tomado','en_preparacion','listo'].includes(o.status)).length
  const ingresosDia    = orders
    .filter((o) => o.status === 'pagado' || o.status === 'finalizado')
    .reduce((sum, o) => sum + o.total, 0)
  const domiciliosActivos = deliveries.filter((d) => ['asignado','en_camino'].includes(d.status)).length

  return (
    <Layout>
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">El Sazón Uvitano</p>
        <h1 className="text-xl font-bold text-stone-900 font-heading mt-0.5">
          Hola, {firstName} 👋
        </h1>
      </div>

      {/* Métricas 2×2 */}
      <div className="px-5 grid grid-cols-2 gap-3">
        <MetricCard
          label="Mesas activas"
          value={mesasActivas}
          icon="🪑"
          bgClass="bg-amber-50"
          textClass="text-amber-800"
        />
        <MetricCard
          label="Pedidos pendientes"
          value={pedidosPendientes}
          icon="📋"
          bgClass="bg-orange-50"
          textClass="text-orange-800"
        />
        <MetricCard
          label="Ingresos del día"
          value={formatCurrency(ingresosDia)}
          icon="💰"
          bgClass="bg-green-50"
          textClass="text-green-800"
        />
        <MetricCard
          label="Domicilios activos"
          value={domiciliosActivos}
          icon="🛵"
          bgClass="bg-blue-50"
          textClass="text-blue-800"
        />
      </div>

      {/* Divider decorativo */}
      <div className="mx-5 my-5 h-px bg-linear-to-r from-transparent via-amber-300 to-transparent" />

      {/* Info del sistema */}
      <div className="mx-5 bg-white border border-stone-100 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-stone-800 font-heading">Información del sistema</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-400">Rol</span>
          {roleCfg && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleCfg.color} ${roleCfg.textColor}`}>
              {roleCfg.icon} {roleCfg.label}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-400">ID de usuario</span>
          <span className="font-mono text-xs text-stone-600 truncate max-w-35">{user?.id}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-400">Estado operativo</span>
          <span className="flex items-center gap-1.5 text-green-700 font-medium text-xs">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
            En línea
          </span>
        </div>
      </div>
    </Layout>
  )
}

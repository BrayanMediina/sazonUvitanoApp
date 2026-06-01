import { useAppStore } from '../../store'
import Layout from '../../components/Layout'


export default function DashboardPage() {
  const user = useAppStore((state) => state.user)

  const stats = [
    {
      title: 'Mesas activas',
      value: '0',
      sub: 'Sin ocupación',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M6 6h.01M18 6h.01M6 18h.01M18 18h.01M5 6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6z" />
        </svg>
      ),
      cardCls: 'bg-amber-50 border-amber-100',
      textCls: 'text-amber-800',
      subCls: 'text-amber-600',
      iconCls: 'bg-amber-200 text-amber-700',
    },
    {
      title: 'Pedidos pendientes',
      value: '0',
      sub: 'En preparación',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      cardCls: 'bg-orange-50 border-orange-100',
      textCls: 'text-orange-800',
      subCls: 'text-orange-600',
      iconCls: 'bg-orange-200 text-orange-700',
    },
    {
      title: 'Ingresos hoy',
      value: '$0',
      sub: 'Hasta el momento',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      cardCls: 'bg-green-50 border-green-100',
      textCls: 'text-green-800',
      subCls: 'text-green-600',
      iconCls: 'bg-green-200 text-green-700',
    },
    {
      title: 'Domicilios activos',
      value: '0',
      sub: 'En tránsito',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      cardCls: 'bg-blue-50 border-blue-100',
      textCls: 'text-blue-800',
      subCls: 'text-blue-600',
      iconCls: 'bg-blue-200 text-blue-700',
    },
  ]

  const roleLabel: Record<string, string> = {
    administrador: 'Administrador',
    mesero: 'Mesero',
    cajero: 'Cajero',
    domiciliario: 'Domiciliario',
  }

  const roleColor: Record<string, string> = {
    administrador: 'bg-amber-100 text-amber-800',
    mesero: 'bg-orange-100 text-orange-800',
    cajero: 'bg-green-100 text-green-800',
    domiciliario: 'bg-blue-100 text-blue-800',
  }

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-5 px-4 pb-8 pt-2">

        {/* Header */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 mb-0.5">
            Panel de control
          </p>
          <h2 className="text-xl font-bold text-stone-900 leading-snug">
            Bienvenido, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-stone-400 mt-0.5">
            Operaciones de El Sazón Uvitano
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-amber-200 via-amber-100 to-transparent" />

        {/* Stats — 2 columnas en móvil */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div
              key={s.title}
              className={`flex flex-col gap-3 rounded-2xl border p-4 active:scale-95 transition-transform ${s.cardCls}`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2 ${s.iconCls}`}>{s.icon}</div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.textCls}`}>{s.value}</p>
                <p className={`text-[11px] font-semibold mt-0.5 ${s.subCls}`}>{s.title}</p>
                <p className={`text-[10px] mt-0.5 opacity-70 ${s.subCls}`}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info del sistema */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-4 rounded-full bg-amber-500" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
              Información del sistema
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-sm text-stone-500">Rol asignado</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${roleColor[user?.role ?? ''] ?? 'bg-stone-100 text-stone-700'}`}>
                {roleLabel[user?.role ?? ''] ?? user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-stone-100">
              <span className="text-sm text-stone-500">ID de usuario</span>
              <span className="text-sm font-mono font-semibold text-stone-700 truncate max-w-[160px]">{user?.id}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-stone-500">Estado</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-stone-700">Operativo</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
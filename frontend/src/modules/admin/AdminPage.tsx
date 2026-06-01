import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import PageHeader from '../../components/layout/PageHeader'

const CARDS = [
  { label: 'Usuarios',   icon: '👥', path: '/admin/usuarios',  desc: 'Gestionar cuentas y roles' },
  { label: 'Menú',       icon: '🍽️', path: '/admin/productos', desc: 'Productos y precios' },
  { label: 'Mesas',      icon: '🪑', path: '/admin/mesas',     desc: 'Configurar mesas' },
  { label: 'Reportes',   icon: '📊', path: '/reportes',        desc: 'Estadísticas y análisis' },
]

export default function AdminPage() {
  const navigate = useNavigate()

  return (
    <Layout title="Admin">
      <PageHeader title="Panel Admin" subtitle="Gestión completa del restaurante" />

      <div className="px-5 grid grid-cols-2 gap-3 pb-8">
        {CARDS.map((c) => (
          <button
            key={c.path}
            onClick={() => navigate(c.path)}
            className="bg-white border border-stone-100 rounded-2xl p-5 text-left active:scale-95 transition-all hover:border-brand-200"
          >
            <p className="text-3xl mb-3">{c.icon}</p>
            <p className="text-sm font-bold text-stone-800 font-heading">{c.label}</p>
            <p className="text-xs text-stone-400 mt-0.5">{c.desc}</p>
          </button>
        ))}
      </div>
    </Layout>
  )
}

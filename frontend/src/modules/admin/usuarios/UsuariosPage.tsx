import { useState } from 'react'
import Layout from '../../../components/layout/Layout'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import UsuarioRow from './UsuarioRow'
import UsuarioFormModal from './UsuarioFormModal'
import { useUsers } from '../../../hooks/useUsers'
import { ROLE_CONFIG } from '../../../constants/orderStatus'
import type { Role } from '../../../types'

const ROLE_FILTERS: { label: string; value: Role | 'all' }[] = [
  { label: 'Todos',          value: 'all' },
  { label: 'Administradores',value: 'administrador' },
  { label: 'Cajeros',        value: 'cajero' },
  { label: 'Meseros',        value: 'mesero' },
  { label: 'Domiciliarios',  value: 'domiciliario' },
]

export default function UsuariosPage() {
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')
  const [search, setSearch]         = useState('')
  const [showModal, setShowModal]   = useState(false)

  const { data: response, isLoading } = useUsers(roleFilter === 'all' ? undefined : roleFilter)
  const users = response?.data ?? []

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.document.includes(search)
  )

  return (
    <Layout showBack title="Usuarios">
      <PageHeader
        title="Usuarios"
        actions={<Button size="sm" onClick={() => setShowModal(true)}>+ Nuevo</Button>}
      />

      {/* Buscador */}
      <div className="px-5 mb-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o documento…"
          className="w-full px-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Filtros por rol */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setRoleFilter(f.value)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                roleFilter === f.value ? 'bg-brand-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {f.value !== 'all' && ROLE_CONFIG[f.value as Role].icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-5 space-y-2 pb-6">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && filtered.length === 0 && (
          <EmptyState icon="👥" title="Sin usuarios" description="No se encontraron usuarios" />
        )}
        {!isLoading && filtered.map((user) => (
          <UsuarioRow key={user.id} user={user} />
        ))}
      </div>

      <UsuarioFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  )
}

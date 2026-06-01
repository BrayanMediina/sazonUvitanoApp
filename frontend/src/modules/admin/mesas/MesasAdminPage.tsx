import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Layout from '../../../components/layout/Layout'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import MesaStatusBadge from '../../mesas/components/MesaStatusBadge'
import MesaFormModal from './MesaFormModal'
import { useTables } from '../../../hooks/useTables'
import { useAppStore, type AppStore } from '../../../store'
import { tablesService } from '../../../services/api'
import type { Table } from '../../../types'

export default function MesasAdminPage() {
  const [showNew, setShowNew]     = useState(false)
  const [editing, setEditing]     = useState<Table | undefined>()
  const qc = useQueryClient()

  const { isLoading } = useTables()
  const rawTables = useAppStore((s) => (s as AppStore).tables)
  const tables = rawTables as import('../../../types').Table[]

  const { mutate: deleteTable } = useMutation({
    mutationFn: (id: string) => tablesService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables'] }) },
  })

  return (
    <Layout showBack title="Mesas">
      <PageHeader
        title="Configuración de mesas"
        subtitle={`${tables.length} mesas registradas`}
        actions={<Button size="sm" onClick={() => setShowNew(true)}>+ Nueva</Button>}
      />

      <div className="px-5 space-y-3 pb-6">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && tables.length === 0 && (
          <EmptyState icon="🪑" title="Sin mesas" description="Agrega la primera mesa del restaurante" />
        )}
        {!isLoading && tables.map((table) => (
          <div key={table.id} className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold text-stone-800 font-heading">Mesa {table.number}</p>
              {table.zone && <p className="text-xs text-stone-400">{table.zone}</p>}
              {table.capacity && <p className="text-xs text-stone-400">{table.capacity} personas</p>}
            </div>
            <MesaStatusBadge status={table.status} />
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => setEditing(table)} className="text-xs font-medium text-brand-700 active:opacity-70">
                Editar
              </button>
              {table.status === 'disponible' && (
                <button
                  onClick={() => { if (confirm('¿Eliminar esta mesa?')) deleteTable(table.id) }}
                  className="text-xs font-medium text-red-500 active:opacity-70"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <MesaFormModal isOpen={showNew} onClose={() => setShowNew(false)} />
      <MesaFormModal isOpen={!!editing} onClose={() => setEditing(undefined)} table={editing} />
    </Layout>
  )
}

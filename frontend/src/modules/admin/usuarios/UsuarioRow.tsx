import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Avatar from '../../../components/ui/Avatar'
import UsuarioFormModal from './UsuarioFormModal'
import { ROLE_CONFIG } from '../../../constants/orderStatus'
import { usersService } from '../../../services/api'
import type { User } from '../../../types'

export default function UsuarioRow({ user }: { user: User }) {
  const [showEdit, setShowEdit] = useState(false)
  const qc = useQueryClient()
  const roleCfg = ROLE_CONFIG[user.role]

  const { mutate: toggle } = useMutation({
    mutationFn: () => usersService.toggleActive(user.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }) },
  })

  return (
    <>
      <div className="bg-white border border-stone-100 rounded-2xl p-4 flex items-center gap-3">
        <Avatar name={user.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
          <p className="text-xs text-stone-400 truncate">{user.document}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleCfg.color} ${roleCfg.textColor}`}>
            {roleCfg.icon} {roleCfg.label}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {user.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button onClick={() => setShowEdit(true)} className="text-xs font-medium text-brand-700 active:opacity-70">
            Editar
          </button>
          <button onClick={() => toggle()} className="text-xs font-medium text-stone-500 active:opacity-70">
            {user.isActive ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      <UsuarioFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} user={user} />
    </>
  )
}

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { ROLE_CONFIG } from '../../../constants/orderStatus'
import { usersService } from '../../../services/api'
import type { User, Role } from '../../../types'

const schema = z.object({
  name:     z.string().min(2),
  document: z.string().min(5),
  email:    z.string().email().optional().or(z.literal('')),
  phone:    z.string().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  role:     z.enum(['mesero','cajero','domiciliario','administrador'] as const),
  isActive: z.boolean(),
})
type FormData = z.infer<typeof schema>

const ROLES: Role[] = ['mesero', 'cajero', 'domiciliario', 'administrador']

interface UsuarioFormModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User
}

export default function UsuarioFormModal({ isOpen, onClose, user }: UsuarioFormModalProps) {
  const qc = useQueryClient()
  const isEdit = !!user

  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'mesero', isActive: true },
  })

  useEffect(() => {
    if (user) {
      reset({ name: user.name, document: user.document, email: user.email ?? '', phone: user.phone ?? '', role: user.role, isActive: user.isActive, password: '' })
    } else {
      reset({ role: 'mesero', isActive: true })
    }
  }, [user, reset])

  const selectedRole = watch('role')

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => isEdit
      ? usersService.update(user!.id, { name: data.name, email: data.email || undefined, phone: data.phone || undefined, role: data.role, isActive: data.isActive })
      : usersService.create({ name: data.name, document: data.document, email: data.email || undefined, phone: data.phone || undefined, password: data.password!, role: data.role }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); onClose() },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      footer={
        <Button fullWidth isLoading={isSubmitting} onClick={handleSubmit((d) => mutate(d))}>
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      }
    >
      <form className="space-y-3" onSubmit={handleSubmit((d) => mutate(d))}>
        <Input label="Nombre completo" {...register('name')} error={errors.name?.message} />
        <Input label="Documento" {...register('document')} disabled={isEdit} error={errors.document?.message} />
        <Input label="Email (opcional)" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Teléfono (opcional)" type="tel" {...register('phone')} />
        {!isEdit && (
          <Input label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
        )}

        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">Rol</p>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => {
              const cfg = ROLE_CONFIG[role]
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('role', role)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left active:scale-95 ${
                    selectedRole === role ? 'border-brand-900 bg-brand-50' : 'border-stone-200'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span className={`text-xs font-semibold ${selectedRole === role ? 'text-brand-900' : 'text-stone-500'}`}>
                    {cfg.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {isEdit && (
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" {...register('isActive')} className="h-4 w-4 accent-brand-900" />
            <label htmlFor="isActive" className="text-sm text-stone-700">Usuario activo</label>
          </div>
        )}
      </form>
    </Modal>
  )
}

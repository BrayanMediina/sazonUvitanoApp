import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/api'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { ROLE_CONFIG } from '../../constants/orderStatus'
import type { Role } from '../../types'

const schema = z.object({
  name:     z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  document: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  email:    z.string().email('Email inválido').optional().or(z.literal('')),
  phone:    z.string().optional().or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role:     z.enum(['mesero', 'cajero', 'domiciliario', 'administrador'] as const),
})

type FormData = z.infer<typeof schema>

const ROLES: Role[] = ['mesero', 'cajero', 'domiciliario', 'administrador']

export default function RegisterForm() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'mesero' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    try {
      setError(null)
      await authService.register({
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
      })
      await login({ document: data.document, password: data.password })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input label="Nombre completo" placeholder="Tu nombre" error={errors.name?.message} {...register('name')} />
      <Input label="Documento" type="text" placeholder="Número de documento" inputMode="numeric" error={errors.document?.message} {...register('document')} />
      <Input label="Email (opcional)" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
      <Input label="Teléfono (opcional)" type="tel" placeholder="+57 300 000 0000" error={errors.phone?.message} {...register('phone')} />
      <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />

      <div>
        <p className="text-sm font-medium text-stone-700 mb-2">Rol</p>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map((role) => {
            const cfg = ROLE_CONFIG[role]
            return (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role, { shouldValidate: true })}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                  selectedRole === role
                    ? 'border-brand-900 bg-brand-50'
                    : 'border-stone-200 bg-white'
                }`}
              >
                <span className="text-lg">{cfg.icon}</span>
                <span className={`text-xs font-semibold ${selectedRole === role ? 'text-brand-900' : 'text-stone-500'}`}>
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>
        {errors.role && <p className="text-xs text-red-500 mt-1.5">{errors.role.message}</p>}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center py-2 px-3 bg-red-50 rounded-xl">{error}</p>
      )}

      <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
        Crear cuenta
      </Button>
    </form>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = z.object({
  document: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError(null)
      await login(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Documento de identidad"
        type="text"
        placeholder="Número de documento"
        inputMode="numeric"
        error={errors.document?.message}
        {...register('document')}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {error && (
        <p className="text-sm text-red-500 text-center py-2 px-3 bg-red-50 rounded-xl">{error}</p>
      )}

      <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} className="mt-2">
        Ingresar
      </Button>
    </form>
  )
}

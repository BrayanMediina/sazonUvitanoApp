import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useFaceAuth } from '../../hooks/useFaceAuth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const schema = z.object({
  document: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})
type FormData = z.infer<typeof schema>

type Mode = 'password' | 'face'

export default function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { loginWithFace, supported, loading: faceLoading, error: faceError } = useFaceAuth()
  const [mode, setMode]   = useState<Mode>('password')
  const [error, setError] = useState<string | null>(null)
  const [doc,   setDoc]   = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onPasswordSubmit = async (data: FormData) => {
    try {
      setError(null)
      await login(data)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  const onFaceLogin = async () => {
    setError(null)
    await loginWithFace(doc)
    // redirect handled by the hook via store update → RequireAuth redirects
  }

  return (
    <div className="space-y-5">
      {/* Selector de método */}
      {supported && (
        <div className="flex bg-stone-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => { setMode('password'); setError(null) }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              mode === 'password' ? 'bg-white text-brand-900 shadow-sm' : 'text-stone-400'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Contraseña
          </button>
          <button
            onClick={() => { setMode('face'); setError(null) }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              mode === 'face' ? 'bg-white text-brand-900 shadow-sm' : 'text-stone-400'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h.01M15 12h.01M9 16s.75 1 3 1 3-1 3-1" />
            </svg>
            Reconoc. facial
          </button>
        </div>
      )}

      {/* ── Modo contraseña ── */}
      {mode === 'password' && (
        <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4" noValidate>
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
      )}

      {/* ── Modo reconocimiento facial ── */}
      {mode === 'face' && (
        <div className="space-y-4">
          <Input
            label="Documento de identidad"
            type="text"
            placeholder="Número de documento"
            inputMode="numeric"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
          />

          {/* Ilustración / ícono biométrico */}
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative h-24 w-24 flex items-center justify-center rounded-full bg-brand-50 border-2 border-brand-200">
              <svg className="h-12 w-12 text-brand-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.34V5a5 5 0 0010 0V3.34M12 14c-3.313 0-6-2.686-6-6V6a6 6 0 0112 0v2c0 3.314-2.687 6-6 6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a3 3 0 006 0" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.5h.01M15 8.5h.01" />
              </svg>
              {faceLoading && (
                <span className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
              )}
            </div>
            <p className="text-sm text-stone-600 text-center leading-relaxed">
              {faceLoading
                ? 'Verificando identidad…'
                : 'Toca el botón para activar el reconocimiento facial de tu dispositivo'}
            </p>
          </div>

          {(error || faceError) && (
            <p className="text-sm text-red-500 text-center py-2 px-3 bg-red-50 rounded-xl">
              {error ?? faceError}
            </p>
          )}

          <Button
            fullWidth
            size="lg"
            isLoading={faceLoading}
            disabled={faceLoading || !doc.trim()}
            onClick={onFaceLogin}
          >
            🔐 Reconocimiento facial
          </Button>

          <p className="text-xs text-stone-400 text-center">
            ¿No tienes biometría registrada?{' '}
            <button
              type="button"
              onClick={() => setMode('password')}
              className="text-brand-700 font-semibold"
            >
              Ingresa con contraseña
            </button>
          </p>
        </div>
      )}
    </div>
  )
}

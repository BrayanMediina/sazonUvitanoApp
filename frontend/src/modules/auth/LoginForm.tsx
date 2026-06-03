import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../hooks/useAuth'
import { useFaceCamera } from '../../hooks/useFaceCamera'
import CameraFaceCapture from '../../components/auth/CameraFaceCapture'
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
  const { videoRef, state, error: faceError, loginWithFace, reset } = useFaceCamera()

  const [mode, setMode]     = useState<Mode>('password')
  const [error, setError]   = useState<string | null>(null)
  const [doc, setDoc]       = useState('')
  const [faceStarted, setFaceStarted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const switchMode = (m: Mode) => {
    reset()
    setFaceStarted(false)
    setError(null)
    setMode(m)
  }

  const onPasswordSubmit = async (data: FormData) => {
    try {
      setError(null)
      await login(data)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  const startFaceScan = async () => {
    setFaceStarted(true)
    await loginWithFace(doc)
    // Si fue exitoso, la store se actualizó y RequireAuth redirigirá
  }

  return (
    <div className="space-y-5">
      {/* Selector de método */}
      <div className="flex bg-stone-100 rounded-2xl p-1 gap-1">
        <button
          type="button"
          onClick={() => switchMode('password')}
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
          type="button"
          onClick={() => switchMode('face')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            mode === 'face' ? 'bg-white text-brand-900 shadow-sm' : 'text-stone-400'
          }`}
        >
          {/* Ícono de cámara */}
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          Reconoc. facial
        </button>
      </div>

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
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Ingresar
          </Button>
        </form>
      )}

      {/* ── Modo reconocimiento facial ── */}
      {mode === 'face' && (
        <div className="space-y-4">
          {/* Documento — siempre visible para saber a quién buscar */}
          {!faceStarted && (
            <Input
              label="Documento de identidad"
              type="text"
              placeholder="Número de documento"
              inputMode="numeric"
              value={doc}
              onChange={(e) => setDoc(e.target.value)}
            />
          )}

          {/* Cámara */}
          {faceStarted && (
            <CameraFaceCapture
              videoRef={videoRef}
              state={state}
              error={faceError}
              onCancel={() => { reset(); setFaceStarted(false) }}
            />
          )}

          {/* Botón activar cámara */}
          {!faceStarted && (
            <Button
              fullWidth
              size="lg"
              disabled={!doc.trim()}
              onClick={startFaceScan}
            >
              <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              Activar cámara
            </Button>
          )}

          {/* Reintentar tras error */}
          {state === 'error' && (
            <Button
              variant="outline"
              fullWidth
              size="lg"
              onClick={() => { reset(); setFaceStarted(false) }}
            >
              Intentar de nuevo
            </Button>
          )}

          <p className="text-xs text-stone-400 text-center">
            ¿No tienes reconocimiento facial?{' '}
            <button type="button" onClick={() => switchMode('password')} className="text-brand-700 font-semibold">
              Ingresa con contraseña
            </button>
          </p>
        </div>
      )}
    </div>
  )
}

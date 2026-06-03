import { useEffect, useState } from 'react'
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
  const navigate  = useNavigate()
  const { login } = useAuth()
  const { videoRef, state, error: faceError, loginWithFace, reset } = useFaceCamera()

  const [mode,        setMode]        = useState<Mode>('password')
  const [error,       setError]       = useState<string | null>(null)
  const [doc,         setDoc]         = useState('')
  const [cameraOpen,  setCameraOpen]  = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  // Bloquear scroll mientras el overlay de cámara está abierto
  useEffect(() => {
    document.body.style.overflow = cameraOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cameraOpen])

  const switchMode = (m: Mode) => { reset(); setCameraOpen(false); setError(null); setMode(m) }

  const onPasswordSubmit = async (data: FormData) => {
    try {
      setError(null)
      await login(data)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  const openFaceCamera = async () => {
    setCameraOpen(true)
    await loginWithFace(doc)
    // Si fue exitoso, la store se actualizó → RequireAuth redirigirá
  }

  const closeFaceCamera = () => { reset(); setCameraOpen(false) }

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

      {/* ── Modo facial: formulario de documento ── */}
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

          <Button
            fullWidth
            size="lg"
            disabled={!doc.trim()}
            onClick={openFaceCamera}
          >
            <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            Activar cámara
          </Button>

          <p className="text-xs text-stone-400 text-center">
            ¿No tienes reconocimiento facial?{' '}
            <button type="button" onClick={() => switchMode('password')} className="text-brand-700 font-semibold">
              Ingresa con contraseña
            </button>
          </p>
        </div>
      )}

      {/* ── Overlay pantalla completa cuando la cámara está activa ── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          {/* Encabezado */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <h2 className="text-base font-bold text-white">Verificando identidad</h2>
            {(state === 'error' || state === 'success') && (
              <button
                onClick={closeFaceCamera}
                className="min-w-10 min-h-10 flex items-center justify-center rounded-xl text-white/60 active:text-white active:bg-white/10"
                aria-label="Cerrar"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Cámara centrada */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
            <CameraFaceCapture
              videoRef={videoRef}
              state={state}
              error={faceError}
            />
          </div>

          {/* Pie */}
          <div className="px-5 pb-8 pt-4 shrink-0">
            {state === 'error' && (
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => { reset(); openFaceCamera() }}>
                  Reintentar
                </Button>
                <Button variant="outline" fullWidth onClick={closeFaceCamera}>
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

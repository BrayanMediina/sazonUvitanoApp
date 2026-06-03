import { useEffect, useRef } from 'react'
import { useFaceCamera } from '../../hooks/useFaceCamera'
import CameraFaceCapture from '../../components/auth/CameraFaceCapture'
import Button from '../../components/ui/Button'

interface Props {
  open:    boolean
  onClose: () => void
}

/**
 * Overlay de pantalla completa para registrar el reconocimiento facial.
 * Idéntico al overlay de login: cámara activa automáticamente, escaneo
 * continuo hasta detectar un rostro, guarda el descriptor y cierra.
 *
 * Uso en TopBar:
 *   const [faceOpen, setFaceOpen] = useState(false)
 *   <RegisterFaceButton open={faceOpen} onClose={() => setFaceOpen(false)} />
 */
export default function RegisterFaceButton({ open, onClose }: Props) {
  const { videoRef, state, error, enrollFace, reset } = useFaceCamera()
  const startedRef = useRef(false)

  // Bloquear scroll mientras el overlay está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Arrancar la cámara en cuanto se abre el overlay (solo una vez por apertura)
  useEffect(() => {
    if (open && !startedRef.current) {
      startedRef.current = true
      enrollFace()
    }
    if (!open) {
      startedRef.current = false
      reset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClose = () => {
    // Capturar estado ANTES de resetear
    const wasSuccess = state === 'success'
    reset()
    onClose()
    if (wasSuccess) {
      // Toast o acción extra si se necesita en el futuro
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Encabezado */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <h2 className="text-base font-bold text-white">Registrar reconocimiento facial</h2>
        {/* Cerrar solo cuando no está en medio del escaneo */}
        {(state === 'idle' || state === 'success' || state === 'error') && (
          <button
            onClick={handleClose}
            className="min-w-10 min-h-10 flex items-center justify-center rounded-xl text-white/60 active:text-white active:bg-white/10"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Zona central — cámara */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <CameraFaceCapture
          videoRef={videoRef}
          state={state}
          error={error}
        />

        {/* Instrucción adicional durante el escaneo */}
        {(state === 'scanning' || state === 'loading_models' || state === 'starting_camera') && (
          <p className="text-xs text-white/50 text-center max-w-xs leading-relaxed">
            Mira directamente a la cámara con buena iluminación
          </p>
        )}

        {/* Mensaje de éxito */}
        {state === 'success' && (
          <p className="text-sm text-green-400 text-center font-medium max-w-xs leading-relaxed">
            ¡Listo! Tu reconocimiento facial quedó guardado.{'\n'}
            La próxima vez puedes ingresar sin contraseña.
          </p>
        )}
      </div>

      {/* Pie — botones */}
      <div className="px-5 pb-8 pt-4 shrink-0 space-y-3">
        {state === 'success' && (
          <Button fullWidth size="lg" onClick={handleClose}>
            Perfecto, listo
          </Button>
        )}

        {state === 'error' && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                reset()
                startedRef.current = false
                // Relanzar enrollFace en el siguiente tick
                setTimeout(() => {
                  startedRef.current = true
                  enrollFace()
                }, 100)
              }}
            >
              Reintentar
            </Button>
            <Button variant="outline" fullWidth onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

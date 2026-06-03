import { useEffect, useState } from 'react'
import { useFaceCamera } from '../../hooks/useFaceCamera'
import CameraFaceCapture from '../../components/auth/CameraFaceCapture'
import Button from '../../components/ui/Button'

interface Props { onDone?: () => void }

export default function RegisterFaceButton({ onDone }: Props) {
  const [open, setOpen] = useState(false)
  const { videoRef, state, error, enrollFace, reset } = useFaceCamera()

  // Bloquear scroll del body mientras el overlay está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleOpen = () => { reset(); setOpen(true) }

  const handleClose = () => {
    reset()
    setOpen(false)
    if (state === 'success') onDone?.()
  }

  const handleStart = () => { enrollFace() }

  return (
    <>
      {/* Entrada en el menú de usuario */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-700 active:bg-brand-50 transition-colors"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        Registrar reconocimiento facial
      </button>

      {/* ── Overlay de pantalla completa ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          {/* Encabezado */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <h2 className="text-base font-bold text-white">Reconocimiento facial</h2>
            <button
              onClick={handleClose}
              className="min-w-10 min-h-10 flex items-center justify-center rounded-xl text-white/60 active:text-white active:bg-white/10"
              aria-label="Cerrar"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Zona central — cámara */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">

            {/* Instrucción inicial */}
            {state === 'idle' && (
              <p className="text-sm text-white/70 text-center leading-relaxed max-w-xs">
                Colócate frente a la cámara con buena iluminación. Se capturará tu rostro para futuras autenticaciones.
              </p>
            )}

            {/* Componente de cámara */}
            {state !== 'idle' && (
              <CameraFaceCapture
                videoRef={videoRef}
                state={state}
                error={error}
              />
            )}

            {/* Mensaje de éxito */}
            {state === 'success' && (
              <p className="text-sm text-green-400 text-center font-medium max-w-xs leading-relaxed">
                ¡Reconocimiento facial guardado! Ahora puedes ingresar sin contraseña.
              </p>
            )}
          </div>

          {/* Pie — botones */}
          <div className="px-5 pb-8 pt-4 shrink-0 space-y-3">
            {state === 'idle' && (
              <Button fullWidth size="lg" onClick={handleStart}>
                <svg className="h-5 w-5 mr-2 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                Activar cámara y capturar
              </Button>
            )}

            {state === 'success' && (
              <Button fullWidth size="lg" onClick={handleClose}>Listo</Button>
            )}

            {state === 'error' && (
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => reset()}>
                  Reintentar
                </Button>
                <Button variant="outline" fullWidth onClick={handleClose}>
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

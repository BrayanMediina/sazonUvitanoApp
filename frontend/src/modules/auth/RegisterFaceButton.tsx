import { useState } from 'react'
import { useFaceCamera } from '../../hooks/useFaceCamera'
import CameraFaceCapture from '../../components/auth/CameraFaceCapture'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'

interface Props { onDone?: () => void }

export default function RegisterFaceButton({ onDone }: Props) {
  const [open, setOpen] = useState(false)
  const { videoRef, state, error, enrollFace, reset } = useFaceCamera()

  const handleOpen = () => {
    reset()
    setOpen(true)
  }

  const handleClose = () => {
    reset()
    setOpen(false)
    if (state === 'success') onDone?.()
  }

  const handleStart = async () => {
    await enrollFace()
    // Si fue exitoso, state === 'success'
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-700 active:bg-brand-50 transition-colors"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
        Registrar reconocimiento facial
      </button>

      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Reconocimiento facial"
        centered
        footer={
          state === 'idle' ? (
            <Button fullWidth onClick={handleStart}>
              Activar cámara y capturar
            </Button>
          ) : state === 'success' ? (
            <Button fullWidth onClick={handleClose}>Listo</Button>
          ) : state === 'error' ? (
            <div className="flex gap-2">
              <Button variant="outline" fullWidth onClick={() => reset()}>Reintentar</Button>
              <Button variant="outline" fullWidth onClick={handleClose}>Cancelar</Button>
            </div>
          ) : null
        }
      >
        <div className="space-y-3">
          {state === 'idle' && (
            <p className="text-sm text-stone-500 text-center leading-relaxed px-2">
              Colócate frente a la cámara con buena iluminación. Se capturará tu rostro para futuras autenticaciones.
            </p>
          )}

          {state !== 'idle' && (
            <CameraFaceCapture
              videoRef={videoRef}
              state={state}
              error={error}
            />
          )}

          {state === 'success' && (
            <p className="text-sm text-green-700 text-center font-medium">
              Tu reconocimiento facial quedó guardado. Ahora puedes ingresar sin contraseña.
            </p>
          )}
        </div>
      </Modal>
    </>
  )
}

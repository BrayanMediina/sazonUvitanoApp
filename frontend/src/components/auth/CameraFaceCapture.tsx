import type { RefObject } from 'react'
import type { CameraState } from '../../hooks/useFaceCamera'

const STATUS_MSG: Partial<Record<CameraState, { text: string; cls: string }>> = {
  loading_models:  { text: 'Cargando modelos de IA…',        cls: 'text-white/70'   },
  starting_camera: { text: 'Iniciando cámara…',              cls: 'text-white/70'   },
  scanning:        { text: 'Buscando tu rostro…',            cls: 'text-amber-400'  },
  face_detected:   { text: '¡Rostro detectado! Espera…',     cls: 'text-green-400'  },
  processing:      { text: 'Verificando identidad…',         cls: 'text-blue-300'   },
  success:         { text: '¡Identidad verificada!',         cls: 'text-green-400'  },
}

interface Props {
  videoRef:  RefObject<HTMLVideoElement | null>
  state:     CameraState
  error:     string | null
  onCancel?: () => void
}

export default function CameraFaceCapture({ videoRef, state, error, onCancel }: Props) {
  const isActive  = ['scanning', 'face_detected', 'processing'].includes(state)
  const isSuccess = state === 'success'
  const isIdle    = ['idle', 'loading_models', 'starting_camera'].includes(state)

  const ringColor =
    state === 'face_detected' ? 'border-green-400' :
    state === 'success'       ? 'border-green-500' :
    isActive                  ? 'border-blue-400'  :
                                'border-white/20'

  const status = STATUS_MSG[state]

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Marco circular de cámara — tamaño responsivo */}
      <div className="relative" style={{ width: 'min(220px, 55vw)', height: 'min(220px, 55vw)' }}>
        <div
          className={`relative w-full h-full rounded-full overflow-hidden border-4 transition-colors duration-300 ${ringColor}`}
        >
          {/* Video — espejo horizontal (selfie) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Placeholder cuando la cámara no está activa */}
          {isIdle && (
            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
              <svg className="h-16 w-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          {/* Overlay de éxito */}
          {isSuccess && (
            <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
              <div className="bg-white rounded-full p-3">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Anillo giratorio de escaneo */}
        {(isActive || state === 'loading_models' || state === 'starting_camera') && (
          <div
            className={`absolute -inset-2 rounded-full border-4 border-transparent animate-spin ${
              state === 'face_detected' ? 'border-t-green-400' : 'border-t-blue-400'
            }`}
            style={{ animationDuration: '1.2s' }}
          />
        )}

        {/* Puntos guía de alineación */}
        {isActive && (
          <>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 h-2.5 w-2.5 bg-blue-400 rounded-full opacity-80" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5  h-2.5 w-2.5 bg-blue-400 rounded-full opacity-80" />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5   h-2.5 w-2.5 bg-blue-400 rounded-full opacity-80" />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5   h-2.5 w-2.5 bg-blue-400 rounded-full opacity-80" />
          </>
        )}
      </div>

      {/* Texto de estado */}
      {status && (
        <p className={`text-sm font-medium text-center ${status.cls}`}>{status.text}</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center bg-red-900/30 border border-red-700/40 rounded-2xl px-4 py-3 max-w-xs leading-relaxed">
          {error}
        </p>
      )}

      {/* Botón cancelar */}
      {onCancel && state !== 'success' && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-white/40 active:text-white/80"
        >
          Cancelar
        </button>
      )}
    </div>
  )
}

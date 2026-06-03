import { useState, useRef, useCallback, useEffect } from 'react'
import { authService } from '../services/api'
import { useAppStore, type AppStore } from '../store'
import { initSocket } from '../sockets/socketService'

// ── Carga diferida de face-api para no bloquear el bundle inicial ─
// Los modelos se cargan desde jsDelivr (CDN) la primera vez y quedan
// en memoria mientras el tab está abierto.
const MODEL_URL = `https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/`

let faceapi: typeof import('@vladmandic/face-api') | null = null
type ModelStatus = 'idle' | 'loading' | 'ready' | 'failed'
let modelStatus: ModelStatus = 'idle'
let modelPromise: Promise<void> | null = null

async function ensureModels(): Promise<void> {
  if (modelStatus === 'ready')   return
  if (modelStatus === 'loading') return modelPromise!
  if (modelStatus === 'failed')  throw new Error('Los modelos de IA no pudieron cargarse')

  modelStatus = 'loading'
  modelPromise = (async () => {
    // Import dinámico — solo cuando se abre la cámara
    const fa = await import('@vladmandic/face-api')
    faceapi   = fa

    await Promise.all([
      fa.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      fa.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      fa.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])

    modelStatus = 'ready'
  })().catch((e) => {
    modelStatus = 'failed'
    throw e
  })

  return modelPromise
}

// ── Tipos de estado de la cámara ─────────────────────────────
export type CameraState =
  | 'idle'
  | 'loading_models'
  | 'starting_camera'
  | 'scanning'           // buscando rostro
  | 'face_detected'      // encontró un rostro
  | 'processing'         // comparando con BD
  | 'success'
  | 'error'

export function useFaceCamera() {
  const [state, setState] = useState<CameraState>('idle')
  const [error, setError] = useState<string | null>(null)

  const videoRef  = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const setUser = useAppStore((s) => (s as AppStore).setUser)

  // ── Detener cámara ──────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  // ── Abrir cámara ────────────────────────────────────────────
  const openCamera = useCallback(async (): Promise<boolean> => {
    setError(null)
    try {
      setState('loading_models')
      await ensureModels()

      setState('starting_camera')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await new Promise<void>((res, rej) => {
          const v = videoRef.current!
          v.onloadedmetadata = () => res()
          v.onerror = () => rej(new Error('video error'))
        })
        await videoRef.current.play()
      }

      setState('scanning')
      return true
    } catch (e: unknown) {
      stopCamera()
      setState('error')
      setError(
        (e as { name?: string }).name === 'NotAllowedError'
          ? 'Permiso de cámara denegado. Habilítalo en la configuración del navegador.'
          : e instanceof Error ? e.message : 'No se pudo acceder a la cámara.',
      )
      return false
    }
  }, [stopCamera])

  // ── Capturar descriptor facial de un frame ──────────────────
  const captureDescriptor = useCallback(async (): Promise<Float32Array | null> => {
    if (!faceapi || !videoRef.current) return null
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor()
    return detection?.descriptor ?? null
  }, [])

  // ── Registrar rostro — mismo loop continuo que loginWithFace ─
  const enrollFace = useCallback(async (): Promise<boolean> => {
    const ok = await openCamera()
    if (!ok) return false

    return new Promise<boolean>((resolve) => {
      let attempts = 0
      const MAX_ATTEMPTS = 20 // 10 segundos a 500 ms

      timerRef.current = setInterval(async () => {
        const descriptor = await captureDescriptor()

        if (descriptor) {
          clearInterval(timerRef.current!); timerRef.current = null
          setState('face_detected')
          await new Promise((r) => setTimeout(r, 400))
          setState('processing')

          try {
            await authService.face.enroll(Array.from(descriptor))
            stopCamera()
            setState('success')
            resolve(true)
          } catch (e: unknown) {
            stopCamera()
            setState('error')
            setError(e instanceof Error ? e.message : 'Error al guardar el reconocimiento facial')
            resolve(false)
          }
        } else if (++attempts >= MAX_ATTEMPTS) {
          clearInterval(timerRef.current!); timerRef.current = null
          stopCamera()
          setState('error')
          setError('No se detectó ningún rostro en 10 segundos. Asegúrate de estar bien iluminado y frente a la cámara.')
          resolve(false)
        }
      }, 500)
    })
  }, [openCamera, stopCamera, captureDescriptor])

  // ── Login con rostro ────────────────────────────────────────
  const loginWithFace = useCallback(async (document: string): Promise<boolean> => {
    if (!document.trim()) { setError('Ingresa tu número de documento primero'); return false }

    const ok = await openCamera()
    if (!ok) return false

    return new Promise<boolean>((resolve) => {
      let attempts = 0
      const MAX_ATTEMPTS = 20 // 10 segundos a 500 ms

      timerRef.current = setInterval(async () => {
        const descriptor = await captureDescriptor()

        if (descriptor) {
          clearInterval(timerRef.current!); timerRef.current = null
          setState('face_detected')
          await new Promise((r) => setTimeout(r, 400))
          setState('processing')

          try {
            const res = await authService.face.verify(document, Array.from(descriptor))
            localStorage.setItem('sazon-access',  res.accessToken)
            localStorage.setItem('sazon-refresh', res.refreshToken)
            setUser(res.user, res.accessToken)
            initSocket(res.accessToken)
            stopCamera()
            setState('success')
            resolve(true)
          } catch (e: unknown) {
            stopCamera()
            setState('error')
            setError(e instanceof Error ? e.message : 'No se pudo verificar el rostro')
            resolve(false)
          }
        } else if (++attempts >= MAX_ATTEMPTS) {
          clearInterval(timerRef.current!); timerRef.current = null
          stopCamera()
          setState('error')
          setError('No se detectó ningún rostro en 10 segundos. Asegúrate de estar bien iluminado.')
          resolve(false)
        }
      }, 500)
    })
  }, [openCamera, stopCamera, captureDescriptor, setUser])

  const reset = useCallback(() => {
    stopCamera()
    setState('idle')
    setError(null)
  }, [stopCamera])

  return { videoRef, state, error, enrollFace, loginWithFace, reset }
}

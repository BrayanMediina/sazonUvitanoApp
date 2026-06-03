import { useState, useCallback } from 'react'
import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
} from '@simplewebauthn/browser'
import { authService } from '../services/api'
import { useAppStore, type AppStore } from '../store'
import { initSocket } from '../sockets/socketService'

export function useFaceAuth() {
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState(false)

  const setUser = useAppStore((s) => (s as AppStore).setUser)

  const supported = browserSupportsWebAuthn()

  // ── Registrar biometría (llamar tras login con contraseña) ────
  const registerFace = useCallback(async () => {
    if (!supported) { setError('Tu dispositivo no soporta reconocimiento facial o biometría.'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const optsRes = await authService.webauthn.registrationOptions()
      const regResponse = await startRegistration({ optionsJSON: optsRes })
      await authService.webauthn.registrationVerify(regResponse)
      setSuccess(true)
    } catch (e: unknown) {
      if ((e as { name?: string }).name === 'NotAllowedError') {
        setError('Cancelado. Inténtalo de nuevo.')
      } else {
        setError(e instanceof Error ? e.message : 'Error al registrar biometría')
      }
    } finally {
      setLoading(false)
    }
  }, [supported])

  // ── Login con biometría ───────────────────────────────────────
  const loginWithFace = useCallback(async (document: string) => {
    if (!supported) { setError('Tu dispositivo no soporta reconocimiento facial o biometría.'); return }
    if (!document.trim()) { setError('Ingresa tu documento primero'); return }
    setLoading(true); setError(null)
    try {
      const { options, userId } = await authService.webauthn.loginOptions(document)
      const authResponse = await startAuthentication({ optionsJSON: options })
      const res = await authService.webauthn.loginVerify(userId, authResponse)
      localStorage.setItem('sazon-access',  res.accessToken)
      localStorage.setItem('sazon-refresh', res.refreshToken)
      setUser(res.user, res.accessToken)
      initSocket(res.accessToken)
    } catch (e: unknown) {
      if ((e as { name?: string }).name === 'NotAllowedError') {
        setError('Cancelado. Inténtalo de nuevo.')
      } else {
        setError(e instanceof Error ? e.message : 'Error al autenticar')
      }
    } finally {
      setLoading(false)
    }
  }, [supported, setUser])

  return { loginWithFace, registerFace, loading, error, success, supported }
}

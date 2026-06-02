import { useEffect } from 'react'
import { useAppStore, type AppStore } from '../store'
import { initSocket } from '../sockets/socketService'

export function useSocket() {
  const user  = useAppStore((s) => (s as AppStore).user)
  const token = useAppStore((s) => (s as AppStore).accessToken)

  useEffect(() => {
    if (!user || !token) return
    const socket = initSocket(token)
    return () => {
      socket.off()
    }
  }, [user, token])
}

export function useSocketInit() {
  const token = useAppStore((s) => (s as AppStore).accessToken)
  const user  = useAppStore((s) => (s as AppStore).user)

  useEffect(() => {
    if (!token || !user) return
    initSocket(token)
    // No desconectar en cleanup: el socket persiste entre páginas.
    // disconnectSocket() solo se llama en useAuth.logout()
  }, [token, user])
}

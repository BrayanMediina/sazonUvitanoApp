import { useEffect } from 'react'
import { useAppStore, type AppStore } from '../store'
import { initSocket, disconnectSocket } from '../sockets/socketService'

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
    return () => { disconnectSocket() }
  }, [token, user])
}

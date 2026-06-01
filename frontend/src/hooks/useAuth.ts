import { useNavigate } from 'react-router-dom'
import { useAppStore, type AppStore } from '../store'
import { authService } from '../services/api'
import { initSocket, disconnectSocket } from '../sockets/socketService'

export function useAuth() {
  const navigate  = useNavigate()
  const setUser   = useAppStore((s) => (s as AppStore).setUser)
  const clearAuth = useAppStore((s) => (s as AppStore).clearAuth)

  const login = async (data: { document: string; password: string }) => {
    const res = await authService.login(data)
    localStorage.setItem('sazon-access', res.accessToken)
    localStorage.setItem('sazon-refresh', res.refreshToken)
    setUser(res.user, res.accessToken)
    initSocket(res.accessToken)
    navigate('/dashboard', { replace: true })
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* silencioso */ }
    localStorage.removeItem('sazon-access')
    localStorage.removeItem('sazon-refresh')
    clearAuth()
    disconnectSocket()
    navigate('/login', { replace: true })
  }

  return { login, logout }
}

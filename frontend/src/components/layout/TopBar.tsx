
raw
Topbar · TSX
// src/components/layout/TopBar.tsx
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
 
interface TopBarProps {
  title?: string
  showBack?: boolean
}
 
export default function TopBar({ title, showBack }: TopBarProps) {
  const navigate  = useNavigate()
  const user      = useAppStore((s) => s.user)
  const unread    = useAppStore((s) => s.unreadNotifications)
  const clearAuth = useAppStore((s) => s.clearAuth)
 
  const handleLogout = () => {
    localStorage.removeItem('sazon-access')
    localStorage.removeItem('sazon-refresh')
    clearAuth()
    navigate('/login')
  }
 
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[60px] bg-white border-b border-stone-200 flex items-center px-4 gap-3">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl active:bg-stone-100 transition-colors"
          aria-label="Volver"
        >
          <svg className="h-5 w-5 text-stone-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <img src="/assets/logo.jpeg" alt="logo" className="h-8 w-8 rounded-full object-cover ring-1 ring-amber-300" />
        </div>
      )}
 
      <div className="flex-1 min-w-0">
        {title
          ? <h1 className="text-base font-bold text-stone-900 truncate">{title}</h1>
          : <div>
              <p className="text-sm font-bold text-stone-900 leading-none">El Sazón Uvitano</p>
              <p className="text-[10px] text-stone-400 leading-none mt-0.5 capitalize">{user?.role}</p>
            </div>
        }
      </div>
 
      <div className="flex items-center gap-1">
        {/* Notificaciones */}
        <button
          onClick={() => {/* abrir notificaciones */}}
          className="relative min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl active:bg-stone-100"
          aria-label="Notificaciones"
        >
          <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute top-2 right-2 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
 
        {/* Avatar / logout */}
        <button
          onClick={handleLogout}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl active:bg-stone-100"
          aria-label="Cerrar sesión"
        >
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-800">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
        </button>
      </div>
    </header>
  )
}
 
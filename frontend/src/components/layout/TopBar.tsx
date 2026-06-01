import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, type AppStore } from '../../store'
import Avatar from '../ui/Avatar'
import NotificationBell from '../ui/NotificationBell'

interface TopBarProps {
  title?: string
  showBack?: boolean
  right?: ReactNode
}

export default function TopBar({ title, showBack, right }: TopBarProps) {
  const navigate  = useNavigate()
  const user      = useAppStore((s) => (s as AppStore).user)
  const unread    = useAppStore((s) => (s as AppStore).unreadNotifications)
  const clearAuth = useAppStore((s) => (s as AppStore).clearAuth)

  const handleLogout = () => {
    localStorage.removeItem('sazon-access')
    localStorage.removeItem('sazon-refresh')
    clearAuth()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-15 bg-white/95 backdrop-blur-sm border-b border-stone-100 flex items-center px-4 gap-3">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="min-w-10 min-h-10 flex items-center justify-center rounded-xl active:bg-stone-100 transition-colors"
          aria-label="Volver"
        >
          <svg className="h-5 w-5 text-stone-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <img
          src="/assets/logo.jpeg"
          alt="El Sazón Uvitano"
          className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-200"
        />
      )}

      <div className="flex-1 min-w-0">
        {title ? (
          <h1 className="text-base font-bold text-stone-900 font-heading truncate">{title}</h1>
        ) : (
          <>
            <p className="text-sm font-bold text-stone-900 font-heading leading-none">El Sazón Uvitano</p>
            <p className="text-[10px] text-stone-400 leading-none mt-0.5 capitalize">{user?.role}</p>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        {right}
        <NotificationBell count={unread} />
        <button
          onClick={handleLogout}
          className="min-w-10 min-h-10 flex items-center justify-center rounded-xl active:bg-stone-100"
          aria-label="Cerrar sesión"
        >
          <Avatar name={user?.name} size="sm" />
        </button>
      </div>
    </header>
  )
}

export { TopBar }

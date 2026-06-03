import { useState, useRef, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, type AppStore } from '../../store'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../ui/Avatar'
import NotificationBell from '../ui/NotificationBell'
import RegisterFaceButton from '../../modules/auth/RegisterFaceButton'
import { ROLE_CONFIG } from '../../constants/orderStatus'

interface TopBarProps {
  title?: string
  showBack?: boolean
  right?: ReactNode
}

export default function TopBar({ title, showBack, right }: TopBarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const user = useAppStore((s) => (s as AppStore).user)

  const [menuOpen, setMenuOpen] = useState(false)
  const [faceOpen, setFaceOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar al tocar fuera
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [menuOpen])

  const roleCfg = user ? ROLE_CONFIG[user.role] : null

  const openFaceRegistration = () => {
    setMenuOpen(false)   // cerrar el menú de usuario
    setFaceOpen(true)    // abrir el overlay de cámara
  }

  return (
    <>
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
          <NotificationBell />

          {/* Botón de usuario con menú desplegable */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="min-w-10 min-h-10 flex items-center justify-center rounded-xl active:bg-stone-100 transition-colors"
              aria-label="Menú de usuario"
            >
              <Avatar name={user?.name} size="sm" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden z-50">
                {/* Info del usuario */}
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-sm font-semibold text-stone-900 truncate">{user?.name}</p>
                  {roleCfg && (
                    <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleCfg.color} ${roleCfg.textColor}`}>
                      {roleCfg.icon} {roleCfg.label}
                    </span>
                  )}
                </div>

                {/* Registrar reconocimiento facial */}
                <button
                  onClick={openFaceRegistration}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-700 active:bg-brand-50 transition-colors"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Registrar reconocimiento facial
                </button>

                <div className="border-t border-stone-100" />

                {/* Cerrar sesión */}
                <button
                  onClick={() => { setMenuOpen(false); logout() }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 active:bg-red-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overlay de reconocimiento facial — fuera del header para z-index correcto */}
      <RegisterFaceButton
        open={faceOpen}
        onClose={() => setFaceOpen(false)}
      />
    </>
  )
}

export { TopBar }

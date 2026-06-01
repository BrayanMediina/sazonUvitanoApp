import type { ReactNode } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import Button from './Button'

export interface HeaderProps {
  userName?: string
  userRole?: string
  isOnline?: boolean
  onLogout?: () => void
  rightContent?: ReactNode
}

export default function Header({ userName, userRole, isOnline = true, onLogout, rightContent }: HeaderProps) {
  return (
    <header className="border-b border-orange-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo y Branding */}
        <div className="flex items-center gap-4">
          <img src="/assets/logo.png" alt="El Sazón Uvitano" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-700">El Sazón Uvitano</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-brand-950">Operaciones</h1>
            <p className="text-sm text-brand-600">Control en tiempo real</p>
          </div>
        </div>

        {/* Right side content */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status online */}
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
            isOnline ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'
          }`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {isOnline ? 'Conectado' : 'Offline'}
          </span>

          {/* User info */}
          {userName && (
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm text-brand-900">
              <span>{userName}</span>
              {userRole && <span className="rounded-full bg-brand-950 px-2 py-1 text-xs text-white">{userRole}</span>}
            </div>
          )}

          {/* Custom content or logout button */}
          {rightContent || (onLogout && <Button variant="primary" size="sm" onClick={onLogout}>Salir</Button>)}
        </div>
      </div>
    </header>
  )
}

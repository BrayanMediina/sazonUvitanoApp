import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Coffee,
  Home,
  MapPinned,
  MessageCircle,
  Navigation,
  PackageCheck,
  Settings,
  ShoppingCart
} from 'lucide-react'
import Header from './Header'
import type { HeaderProps } from './Header'

export interface LayoutProps extends HeaderProps {
  children: ReactNode
  showNav?: boolean
}

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Mesas', path: '/mesas', icon: Coffee },
  { label: 'Pedidos', path: '/pedidos', icon: ShoppingCart },
  { label: 'Caja', path: '/caja', icon: PackageCheck },
  { label: 'Domicilios', path: '/domicilios', icon: Navigation },
  { label: 'Mapa', path: '/mapa', icon: MapPinned },
  { label: 'Chat', path: '/chat', icon: MessageCircle },
  { label: 'Reportes', path: '/reportes', icon: BarChart3 },
  { label: 'Admin', path: '/admin', icon: Settings }
]

export default function Layout({ children, showNav = true, ...headerProps }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-brand-100 text-brand-950">
      <Header {...headerProps} />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        {showNav && (
          <aside className="w-full shrink-0 lg:max-w-xs">
            <nav className="rounded-3xl border border-orange-100 bg-white/95 p-4 shadow-soft sticky top-20">
              <p className="px-3 pb-2 text-sm font-semibold text-brand-700">Área operativa</p>
              <div className="grid gap-2">
                {navItems.map(({ label, path, icon: Icon }) => {
                  const active = location.pathname === path
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        active ? 'bg-brand-950 text-white shadow-soft' : 'text-brand-950 hover:bg-brand-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </aside>
        )}

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

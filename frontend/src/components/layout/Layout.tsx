import type { ReactNode } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import OfflineBanner from '../ui/OfflineBanner'
import { useAppStore } from '../../store'
import { useGPS } from '../../hooks/useGPS'

interface LayoutProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  topBarRight?: ReactNode
}

export default function Layout({ children, title, showBack, topBarRight }: LayoutProps) {
  const isOnline = useAppStore((s) => s.isOnline)
  useGPS() // Activo en todas las páginas; solo opera cuando rol === 'domiciliario'

  return (
    <div className="flex flex-col min-h-dvh bg-stone-50">
      <OfflineBanner isOnline={isOnline} />
      <TopBar title={title} showBack={showBack} right={topBarRight} />
      <main className="flex-1 overflow-y-auto pt-15 pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export { Layout }

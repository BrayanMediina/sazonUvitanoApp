import { useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

export default function InstallBanner() {
  const { canInstall, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!canInstall || dismissed) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-brand-900 text-white rounded-2xl shadow-lg flex items-center gap-3 px-4 py-3 animate-in slide-in-from-bottom-4 duration-300">
      <img src="/icons/icon-192.svg" alt="" className="h-10 w-10 rounded-xl shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">El Sazón Uvitano</p>
        <p className="text-xs text-white/70 leading-tight mt-0.5">Instala la app en tu móvil</p>
      </div>

      <button
        onClick={() => install()}
        className="shrink-0 bg-white text-brand-900 text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all"
      >
        Instalar
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/60 active:text-white p-1"
        aria-label="Cerrar"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

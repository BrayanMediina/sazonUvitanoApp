import { useEffect, useState } from 'react'

export default function UpdateBanner() {
  const [show,          setShow]          = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const check = (reg: ServiceWorkerRegistration) => {
      // Ya hay un SW esperando (instalado pero sin activar)
      if (reg.waiting) {
        setWaitingWorker(reg.waiting)
        setShow(true)
        return
      }
      // Escuchar nueva instalación
      reg.addEventListener('updatefound', () => {
        const next = reg.installing
        if (!next) return
        next.addEventListener('statechange', () => {
          if (next.state === 'installed' && navigator.serviceWorker.controller) {
            setWaitingWorker(next)
            setShow(true)
          }
        })
      })
    }

    navigator.serviceWorker.ready.then(check)

    // Comprobar actualizaciones cada 60 s (útil en tabs que llevan mucho tiempo abiertas)
    const timer = setInterval(() => {
      navigator.serviceWorker.ready.then((r) => r.update().catch(() => { /* sin red */ }))
    }, 60_000)

    return () => clearInterval(timer)
  }, [])

  const apply = () => {
    // Decirle al SW en espera que active ahora
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    // Recargar para que el cliente use el nuevo SW
    window.location.reload()
  }

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-60 bg-brand-900 text-white px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">🔄</span>
        <p className="text-xs font-medium leading-tight">
          Nueva versión disponible
        </p>
      </div>
      <button
        onClick={apply}
        className="shrink-0 bg-white text-brand-900 text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all"
      >
        Actualizar
      </button>
    </div>
  )
}

export default function OfflineBanner({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2">
      <span>📡</span>
      Sin conexión — Modo offline activo
    </div>
  )
}

export { OfflineBanner }

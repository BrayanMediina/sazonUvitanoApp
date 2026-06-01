import { useEffect, type ReactNode } from 'react'
import { cn } from '../../utils/classNames'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export default function BottomSheet({ isOpen, onClose, title, children, footer }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-white rounded-t-3xl shadow-soft',
          'transition-transform duration-200',
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-stone-200 rounded-full" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900 font-heading">{title}</h2>
            <button
              onClick={onClose}
              className="min-w-9 min-h-9 flex items-center justify-center rounded-xl text-stone-400 active:bg-stone-100"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-5 py-4 max-h-[75dvh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 pb-6 pt-2 border-t border-stone-100">{footer}</div>
        )}
      </div>
    </div>
  )
}

export { BottomSheet }

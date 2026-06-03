import { useEffect, type ReactNode } from 'react'
import { cn } from '../../utils/classNames'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Fuerza centrado vertical en móvil (vs bottom-sheet por defecto) */
  centered?: boolean
}

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md', centered = false }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxW = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center p-4',
        centered ? 'items-center' : 'items-end sm:items-center',
      )}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-soft flex flex-col',
          'max-h-[90dvh]',   // nunca superar el 90 % de la pantalla
          maxW[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
            <h2 className="text-base font-bold text-stone-900 font-heading">{title}</h2>
            <button
              onClick={onClose}
              className="min-w-10 min-h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-600 active:bg-stone-100"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Área de contenido con scroll si desborda */}
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t border-stone-100 flex gap-2 justify-end shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export { Modal }

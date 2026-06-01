import { useEffect } from 'react'
import { cn } from '../../utils/classNames'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
  duration?: number
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!onClose) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  const styles = {
    success: 'bg-green-700 text-white',
    error:   'bg-red-600 text-white',
    warning: 'bg-amber-500 text-white',
    info:    'bg-stone-800 text-white',
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-2xl shadow-soft text-sm font-medium', styles[type])}>
      <span>{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
      )}
    </div>
  )
}

export { Toast }

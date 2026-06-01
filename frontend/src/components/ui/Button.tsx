import { cn } from '../../utils/classNames'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1'

  const variants = {
    primary:   'bg-brand-900 text-white hover:bg-brand-800 focus:ring-brand-700',
    secondary: 'bg-brand-100 text-brand-900 hover:bg-brand-200 focus:ring-brand-300',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    ghost:     'bg-transparent text-brand-900 hover:bg-brand-50 focus:ring-brand-200',
    outline:   'border border-brand-900 text-brand-900 bg-transparent hover:bg-brand-50 focus:ring-brand-200',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-3 text-sm min-h-[48px]',
    lg: 'px-6 py-4 text-base min-h-[52px]',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Cargando…
        </span>
      ) : children}
    </button>
  )
}

export { Button }
export type { ButtonProps }

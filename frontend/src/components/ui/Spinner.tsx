import { cn } from '../../utils/classNames'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn(
        'block border-[3px] border-brand-200 border-t-brand-900 rounded-full animate-spin',
        sizes[size],
        className,
      )}
    />
  )
}

export { Spinner }

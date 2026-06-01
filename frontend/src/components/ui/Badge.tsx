import { cn } from '../../utils/classNames'
import type { ReactNode } from 'react'

interface BadgeProps {
  color?: string
  textColor?: string
  children: ReactNode
  className?: string
  dot?: boolean
}

export default function Badge({ color, textColor, children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full',
        color ?? 'bg-stone-100',
        textColor ?? 'text-stone-700',
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', textColor?.replace('text-', 'bg-') ?? 'bg-stone-500')} />}
      {children}
    </span>
  )
}

export { Badge }

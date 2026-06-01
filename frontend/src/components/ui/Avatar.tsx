import { cn } from '../../utils/classNames'

interface AvatarProps {
  name?: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' }
  const initial = name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className={cn('rounded-full bg-brand-100 text-brand-900 font-bold flex items-center justify-center overflow-hidden', sizes[size], className)}>
      {src
        ? <img src={src} alt={name ?? 'Avatar'} className="h-full w-full object-cover" />
        : initial
      }
    </div>
  )
}

export { Avatar }

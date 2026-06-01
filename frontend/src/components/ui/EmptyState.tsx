import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-stone-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-400 mb-5 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

export { EmptyState }

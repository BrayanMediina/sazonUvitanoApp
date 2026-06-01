import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-stone-900 font-heading">{title}</h1>
        {subtitle && <p className="text-sm text-stone-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

export { PageHeader }

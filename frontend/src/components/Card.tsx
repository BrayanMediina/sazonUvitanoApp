import type { ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export default function Card({ children, className = '', title, subtitle }: CardProps) {
  return (
    <div className={`rounded-2xl border border-orange-100 bg-white/95 p-6 shadow-soft ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-brand-950">{title}</h2>
          {subtitle && <p className="text-sm text-brand-600">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

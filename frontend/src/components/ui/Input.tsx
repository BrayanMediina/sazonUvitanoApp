import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/classNames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 min-h-12 border rounded-xl bg-white text-stone-900 placeholder-stone-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors',
            error ? 'border-red-400 focus:ring-red-400' : 'border-stone-200',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        {hint && !error && <p className="text-xs text-stone-400 mt-1.5">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export default Input
export { Input }

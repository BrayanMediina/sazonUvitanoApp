import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/classNames'

interface SelectOption { value: string | number; label: string }

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 min-h-12 border rounded-xl bg-white text-stone-900',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors',
            error ? 'border-red-400' : 'border-stone-200',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'

export default Select
export { Select }

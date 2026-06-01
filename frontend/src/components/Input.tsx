import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium text-brand-950">{label}</label>}
        <input
          ref={ref}
          className={`rounded-lg border bg-white px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-brand-200 focus:border-brand-500 focus:ring-brand-200'
          } ${className || ''}`}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="text-sm text-brand-600">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input

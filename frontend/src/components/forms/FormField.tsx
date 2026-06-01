import Input from '../ui/Input'
import type { InputHTMLAttributes } from 'react'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function FormField({ label, error, hint, ...props }: FormFieldProps) {
  return (
    <div className="mb-4">
      <Input label={label} error={error} hint={hint} {...props} />
    </div>
  )
}

export { FormField }

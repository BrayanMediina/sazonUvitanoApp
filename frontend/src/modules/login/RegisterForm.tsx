import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

export interface RegisterFormProps {
  onSubmit: (data: {
    name: string
    document: string
    email?: string
    phone?: string
    password: string
    role: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export default function RegisterForm({ onSubmit, isLoading = false, error: externalError }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    password: '',
    role: 'mesero'
  })
  const [error, setError] = useState<string | undefined>(externalError)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)

    try {
      await onSubmit({
        ...formData,
        email: formData.email || undefined,
        phone: formData.phone || undefined
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    }
  }

  const fieldClass = "w-full min-h-[48px] rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-base text-stone-800 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all"
  const labelClass = "block text-[10px] font-bold tracking-[0.18em] uppercase text-amber-700 mb-1.5"

  const roles = [
    { value: 'mesero', label: 'Mesero', icon: '🍽️' },
    { value: 'cajero', label: 'Cajero', icon: '💳' },
    { value: 'domiciliario', label: 'Domiciliario', icon: '🛵' },
    { value: 'administrador', label: 'Administrador', icon: '⚙️' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nombre completo</label>
        <Input type="text" name="name" placeholder="Tu nombre completo"
          value={formData.name} onChange={handleChange} disabled={isLoading} required className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Documento</label>
        <Input type="text" name="document" placeholder="Número de documento"
          value={formData.document} onChange={handleChange} disabled={isLoading} required className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Email <span className="normal-case font-normal text-stone-400">(opcional)</span></label>
        <Input type="email" name="email" placeholder="correo@ejemplo.com"
          value={formData.email} onChange={handleChange} disabled={isLoading} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Teléfono <span className="normal-case font-normal text-stone-400">(opcional)</span></label>
        <Input type="tel" name="phone" placeholder="+57 3XX XXX XXXX"
          value={formData.phone} onChange={handleChange} disabled={isLoading} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Contraseña</label>
        <Input type="password" name="password" placeholder="Mínimo 6 caracteres"
          value={formData.password} onChange={handleChange} disabled={isLoading} required className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>Rol</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role: r.value }))}
              disabled={isLoading}
              className={`flex items-center gap-2.5 min-h-12 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                formData.role === r.value
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-stone-200 bg-stone-50 text-stone-500'
              }`}
            >
              <span className="text-base">{r.icon}</span>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="h-5 w-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full min-h-[52px] rounded-2xl bg-amber-700 text-sm font-bold tracking-widest uppercase text-white shadow-md active:scale-95 active:bg-amber-800 disabled:opacity-60 transition-all"
      >
        {isLoading ? 'Registrando...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
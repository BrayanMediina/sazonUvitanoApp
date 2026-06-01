import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

export interface LoginFormProps {
  onSubmit: (data: { document: string; password: string }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export default function LoginForm({ onSubmit, isLoading = false, error: externalError }: LoginFormProps) {
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>(externalError)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)

    try {
      await onSubmit({ document, password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="block text-xs font-semibold tracking-widest uppercase text-amber-700">
          Documento
        </label>
        <Input
          type="text"
          placeholder="Ingresa tu documento"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          disabled={isLoading}
          required
          className="w-full border-0 border-b-2 border-stone-200 bg-transparent px-0 py-2 text-stone-800 placeholder-stone-400 focus:border-amber-600 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold tracking-widest uppercase text-amber-700">
          Contraseña
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="w-full border-0 border-b-2 border-stone-200 bg-transparent px-0 py-2 text-stone-800 placeholder-stone-400 focus:border-amber-600 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
        className="w-full rounded-full bg-amber-700 py-3 text-sm font-bold tracking-widest uppercase text-white shadow-lg hover:bg-amber-800 disabled:opacity-60 transition-all"
      >
        {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
      </Button>
    </form>
  )
}
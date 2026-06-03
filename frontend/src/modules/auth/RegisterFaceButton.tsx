import { useFaceAuth } from '../../hooks/useFaceAuth'

interface Props { onDone?: () => void }

export default function RegisterFaceButton({ onDone }: Props) {
  const { registerFace, loading, error, success, supported } = useFaceAuth()

  if (!supported) return null

  if (success) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-sm text-green-700">
        <span>✅</span>
        <span className="font-medium">¡Biometría registrada!</span>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={async () => { await registerFace(); onDone?.() }}
        disabled={loading}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-700 active:bg-brand-50 transition-colors disabled:opacity-50"
      >
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
        </svg>
        {loading ? 'Registrando…' : 'Registrar reconocimiento facial'}
      </button>
      {error && <p className="text-xs text-red-500 px-4 pb-2">{error}</p>}
    </div>
  )
}

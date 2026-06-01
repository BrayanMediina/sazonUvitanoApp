import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-6 text-center">
      <p className="text-6xl font-bold text-brand-900 font-heading">404</p>
      <p className="text-stone-500">Página no encontrada</p>
      <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-brand-900 text-white rounded-2xl text-sm font-semibold active:scale-95">
        Volver al inicio
      </button>
    </div>
  )
}

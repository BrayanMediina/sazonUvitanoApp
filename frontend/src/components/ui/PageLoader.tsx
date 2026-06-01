import Spinner from './Spinner'

export default function PageLoader({ message = 'Cargando…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-4 bg-white">
      <img src="/assets/logo.jpeg" alt="Sazón Uvitano" className="h-14 w-14 rounded-full object-cover" />
      <Spinner size="md" />
      <p className="text-sm text-stone-400">{message}</p>
    </div>
  )
}

export { PageLoader }

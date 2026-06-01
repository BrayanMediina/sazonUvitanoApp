import Button from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Algo salió mal',
  message = 'Intenta nuevamente',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="text-base font-semibold text-stone-800 mb-1">{title}</h3>
      <p className="text-sm text-stone-400 mb-5 max-w-xs">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} size="sm">Reintentar</Button>
      )}
    </div>
  )
}

export { ErrorState }

interface NotificationBellProps {
  count?: number
  onClick?: () => void
}

export default function NotificationBell({ count = 0, onClick }: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className="relative min-w-10 min-h-10 flex items-center justify-center rounded-xl active:bg-stone-100 transition-colors"
      aria-label={`Notificaciones${count > 0 ? ` (${count})` : ''}`}
    >
      <svg className="h-5 w-5 text-stone-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}

export { NotificationBell }

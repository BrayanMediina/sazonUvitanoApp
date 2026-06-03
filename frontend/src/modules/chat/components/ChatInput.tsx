import { useState, useRef, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
    ref.current?.focus()
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 px-4 py-3 bg-white border-t border-stone-100">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Escribe un mensaje… (Enter para enviar)"
        maxLength={500}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none px-4 py-2.5 bg-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 max-h-24 overflow-y-auto"
        style={{ lineHeight: '1.4' }}
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="h-10 w-10 flex items-center justify-center bg-brand-900 text-white rounded-2xl disabled:opacity-40 active:scale-90 transition-all shrink-0"
        aria-label="Enviar"
      >
        {/* Avión de papel apuntando arriba-derecha */}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.52 60.52 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </div>
  )
}

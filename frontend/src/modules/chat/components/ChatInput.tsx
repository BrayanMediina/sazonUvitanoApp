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
        className="h-10 w-10 flex items-center justify-center bg-brand-900 text-white rounded-2xl disabled:opacity-40 active:scale-90 transition-all"
        aria-label="Enviar"
      >
        <svg className="h-4 w-4 rotate-45" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  )
}

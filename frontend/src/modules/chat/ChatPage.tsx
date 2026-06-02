import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import MessageBubble from './components/MessageBubble'
import ChatInput from './components/ChatInput'
import Spinner from '../../components/ui/Spinner'
import { useAppStore } from '../../store'
import { emitChatMessage } from '../../sockets/socketService'
import { chatService } from '../../services/api'
import { formatDate } from '../../utils/formatDate'

export default function ChatPage() {
  const user        = useAppStore((s) => s.user)
  const messages    = useAppStore((s) => s.messages)
  const markAllRead = useAppStore((s) => s.markAllRead)
  const initMessages = useAppStore((s) => s.initMessages)
  const bottomRef   = useRef<HTMLDivElement>(null)

  // Cargar historial reciente al abrir el chat
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['chat', 'history'],
    queryFn: chatService.getMessages,
    staleTime: Infinity,   // solo carga una vez por sesión
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (history.length > 0) {
      initMessages(history)
    }
  }, [history, initMessages])

  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (content: string) => {
    emitChatMessage(content)
  }

  // Agrupar mensajes por fecha
  const grouped: { date: string; msgs: typeof messages }[] = []
  let lastDate = ''
  for (const msg of messages) {
    const d = formatDate(msg.timestamp)
    if (d !== lastDate) {
      grouped.push({ date: d, msgs: [] })
      lastDate = d
    }
    grouped[grouped.length - 1].msgs.push(msg)
  }

  return (
    <div className="flex flex-col h-dvh">
      <Layout title="Chat">
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm font-medium text-stone-600">Chat del equipo</p>
              <p className="text-xs text-stone-400 mt-1">Sé el primero en escribir</p>
            </div>
          )}

          {grouped.map(({ date, msgs }) => (
            <div key={date}>
              <div className="flex items-center gap-2 my-4">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-[10px] text-stone-400 font-medium px-2">{date}</span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>
              {msgs.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === user?.id}
                />
              ))}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </Layout>

      {/* Input fijo al fondo, encima del BottomNav */}
      <div className="fixed bottom-16 left-0 right-0 z-30">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}

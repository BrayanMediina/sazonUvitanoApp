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
import type { ChatMessage } from '../../types'

export default function ChatPage() {
  const user         = useAppStore((s) => s.user)
  const messages     = useAppStore((s) => s.messages)
  const markAllRead  = useAppStore((s) => s.markAllRead)
  const initMessages = useAppStore((s) => s.initMessages)
  const bottomRef    = useRef<HTMLDivElement>(null)

  // Cargar historial (solo una vez por sesión)
  const { data: history = [], isLoading } = useQuery({
    queryKey: ['chat', 'history'],
    queryFn: chatService.getMessages,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })

  // Combinar historial con mensajes de socket ya recibidos (no borrar mensajes en vuelo)
  useEffect(() => {
    if (!history.length) return
    // Unir historial + mensajes de socket que aún no están en el historial
    const storeMessages = useAppStore.getState().messages
    const socketOnly = storeMessages.filter(
      (m) => !history.some((h: ChatMessage) => h.id === m.id),
    )
    initMessages([...history, ...socketOnly])
  }, [history, initMessages])

  // Marcar como leídos al entrar
  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Agrupar por fecha
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
    <Layout title="Chat del equipo">
      {/*
        Layout ya provee:
          • h-dvh en el contenedor raíz  (alto fijo = viewport)
          • flex-1 overflow-y-auto en <main>  (scroll correcto)
          • pt-15 pb-20 en <main>  (espacio para TopBar y BottomNav)
        Aquí solo agregamos pb-20 extra para que el ChatInput fijo
        (bottom-16, ~64 px de alto) no tape el último mensaje.
      */}
      <div className="px-4 pt-3 pb-20">
        {isLoading && !messages.length && (
          <div className="flex justify-center py-12">
            <Spinner size="sm" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-sm font-semibold text-stone-600">Chat del equipo</p>
            <p className="text-xs text-stone-400 mt-1">Sé el primero en escribir un mensaje</p>
          </div>
        )}

        {grouped.map(({ date, msgs }) => (
          <div key={date}>
            {/* Separador de fecha */}
            <div className="flex items-center gap-2 my-5">
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

        {/* Ancla para auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Input fijo encima del BottomNav (bottom-16 = 64 px = altura del BottomNav) */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-stone-100 shadow-[0_-1px_8px_rgba(0,0,0,.06)]">
        <ChatInput onSend={emitChatMessage} />
      </div>
    </Layout>
  )
}

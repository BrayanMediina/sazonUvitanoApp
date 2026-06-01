import { ROLE_CONFIG } from '../../../constants/orderStatus'
import { formatTime } from '../../../utils/formatDate'
import type { ChatMessage } from '../../../types'

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const roleCfg = ROLE_CONFIG[message.senderRole]

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isOwn ? '' : ''}`}>
        {!isOwn && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-stone-700">{message.senderName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleCfg.color} ${roleCfg.textColor}`}>
              {roleCfg.label}
            </span>
          </div>
        )}
        <div className={`px-4 py-2.5 rounded-2xl ${
          isOwn
            ? 'bg-brand-900 text-white rounded-br-sm'
            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-sm'
        }`}>
          <p className="text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className={`text-[10px] text-stone-400 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

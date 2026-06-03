import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { PAYMENT_METHOD_CONFIG } from '../../../constants/orderStatus'
import { paymentsService } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Order, PaymentMethod } from '../../../types'

const METHODS = Object.keys(PAYMENT_METHOD_CONFIG) as PaymentMethod[]

interface CobroModalProps {
  order: Order | null
  onClose: () => void
  onEdit?: () => void
}

export default function CobroModal({ order, onClose, onEdit }: CobroModalProps) {
  const [method, setMethod] = useState<PaymentMethod>('efectivo')
  const [received, setReceived] = useState('')
  const qc = useQueryClient()

  const receivedNum = parseFloat(received.replace(/\./g, '').replace(',', '.')) || 0
  const change      = method === 'efectivo' && receivedNum > 0 ? receivedNum - (order?.total ?? 0) : null

  const { mutate: pay, isPending } = useMutation({
    mutationFn: () => paymentsService.processPayment({
      orderId: order!.id,
      method,
      receivedAmount: method === 'efectivo' ? receivedNum : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      onClose()
    },
  })

  if (!order) return null

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title="Procesar pago"
      footer={
        <div className="space-y-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700 active:bg-stone-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Corregir pedido
            </button>
          )}
          <Button
            fullWidth
            size="lg"
            isLoading={isPending}
            disabled={method === 'efectivo' && receivedNum < order.total}
            onClick={() => pay()}
          >
            Confirmar pago
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Total destacado */}
        <div className="bg-amber-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-amber-700 font-medium mb-1">Total a cobrar</p>
          <p className="text-3xl font-bold text-brand-900 font-heading">{formatCurrency(order.total)}</p>
        </div>

        {/* Métodos de pago */}
        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">Método de pago</p>
          <div className="grid grid-cols-2 gap-2">
            {METHODS.map((m) => {
              const cfg = PAYMENT_METHOD_CONFIG[m]
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${
                    method === m ? 'border-brand-900 bg-brand-50' : 'border-stone-200'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span className={`text-xs font-semibold ${method === m ? 'text-brand-900' : 'text-stone-600'}`}>
                    {cfg.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Monto recibido (solo efectivo) */}
        {method === 'efectivo' && (
          <div>
            <Input
              label="Monto recibido"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min={order.total}
              value={received}
              onChange={(e) => setReceived(e.target.value)}
            />
            {change !== null && change >= 0 && (
              <div className="mt-2 flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
                <span className="text-sm text-green-700 font-medium">Cambio</span>
                <span className="text-base font-bold text-green-700">{formatCurrency(change)}</span>
              </div>
            )}
            {change !== null && change < 0 && (
              <p className="text-xs text-red-500 mt-1">El monto recibido es menor al total</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

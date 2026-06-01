import BottomSheet from '../../../components/ui/BottomSheet'
import Button from '../../../components/ui/Button'
import OrderItemRow from './OrderItemRow'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Product } from '../../../types'

interface CartItem { productId: string; qty: number }

interface OrderCartProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  products: Product[]
  notes: string
  onNotes: (v: string) => void
  onAdd: (productId: string) => void
  onRemove: (productId: string) => void
  onConfirm: () => void
  isSubmitting: boolean
}

export default function OrderCart({
  isOpen, onClose, cart, products, notes, onNotes, onAdd, onRemove, onConfirm, isSubmitting,
}: OrderCartProps) {
  const items = cart.filter((c) => c.qty > 0)
  const total = items.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId)
    return sum + (p?.price ?? 0) * c.qty
  }, 0)

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Tu pedido"
      footer={
        <Button fullWidth size="lg" isLoading={isSubmitting} onClick={onConfirm} disabled={items.length === 0}>
          Confirmar pedido · {formatCurrency(total)}
        </Button>
      }
    >
      <div className="space-y-1">
        {items.length === 0 ? (
          <p className="text-center text-stone-400 py-6 text-sm">Agrega productos al pedido</p>
        ) : (
          items.map((c) => {
            const p = products.find((x) => x.id === c.productId)
            if (!p) return null
            return (
              <OrderItemRow
                key={c.productId}
                product={p}
                qty={c.qty}
                onAdd={() => onAdd(p.id)}
                onRemove={() => onRemove(p.id)}
              />
            )
          })
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Instrucciones especiales…"
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}
    </BottomSheet>
  )
}

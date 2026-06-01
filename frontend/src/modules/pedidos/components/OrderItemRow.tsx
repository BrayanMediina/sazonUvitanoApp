import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Product } from '../../../types'

interface OrderItemRowProps {
  product: Product
  qty: number
  notes?: string
  onAdd?: () => void
  onRemove?: () => void
  readonly?: boolean
}

export default function OrderItemRow({ product, qty, notes, onAdd, onRemove, readonly }: OrderItemRowProps) {
  const catCfg = CATEGORY_CONFIG[product.category]
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
      <span className="text-xl shrink-0">{catCfg.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800 truncate">{product.name}</p>
        {notes && <p className="text-xs text-stone-400 truncate">{notes}</p>}
        <p className="text-xs text-stone-400">{formatCurrency(product.price)} c/u</p>
      </div>
      {!readonly ? (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRemove}
            className="h-7 w-7 flex items-center justify-center bg-stone-100 rounded-lg text-stone-700 font-bold active:scale-90"
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-bold">{qty}</span>
          <button
            onClick={onAdd}
            className="h-7 w-7 flex items-center justify-center bg-brand-900 rounded-lg text-white font-bold active:scale-90"
          >
            +
          </button>
        </div>
      ) : (
        <div className="text-right shrink-0">
          <p className="text-xs text-stone-400">{qty}×</p>
          <p className="text-sm font-bold text-stone-800">{formatCurrency(product.price * qty)}</p>
        </div>
      )}
    </div>
  )
}

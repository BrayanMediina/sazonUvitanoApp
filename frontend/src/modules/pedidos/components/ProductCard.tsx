import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Product } from '../../../types'

interface ProductCardProps {
  product: Product
  qty: number
  onAdd: () => void
  onRemove: () => void
}

export default function ProductCard({ product, qty, onAdd, onRemove }: ProductCardProps) {
  const catCfg = CATEGORY_CONFIG[product.category]

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-3 flex flex-col gap-2">
      {/* Imagen o ícono */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-20 object-cover rounded-xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-16 bg-brand-50 rounded-xl flex items-center justify-center text-2xl">
          {catCfg.icon}
        </div>
      )}

      <div className="flex-1">
        <p className="text-xs font-semibold text-stone-800 leading-tight">{product.name}</p>
        <p className="text-sm font-bold text-brand-900 mt-0.5">{formatCurrency(product.price)}</p>
      </div>

      {/* Control de cantidad */}
      {qty === 0 ? (
        <button
          onClick={onAdd}
          className="w-full py-2 rounded-xl bg-brand-900 text-white text-sm font-semibold active:scale-95 transition-all"
        >
          + Agregar
        </button>
      ) : (
        <div className="flex items-center justify-between bg-brand-900 rounded-xl px-2 py-1.5">
          <button
            onClick={onRemove}
            className="h-7 w-7 flex items-center justify-center text-white font-bold rounded-lg active:scale-90"
          >
            −
          </button>
          <span className="text-white font-bold text-sm">{qty}</span>
          <button
            onClick={onAdd}
            className="h-7 w-7 flex items-center justify-center text-white font-bold rounded-lg active:scale-90"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}

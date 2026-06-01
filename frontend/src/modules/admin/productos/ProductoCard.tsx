import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ProductoFormModal from './ProductoFormModal'
import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { productsService } from '../../../services/api'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { Product } from '../../../types'

export default function ProductoCard({ product }: { product: Product }) {
  const [showEdit, setShowEdit] = useState(false)
  const qc = useQueryClient()
  const catCfg = CATEGORY_CONFIG[product.category]

  const { mutate: toggleAvail } = useMutation({
    mutationFn: () => productsService.toggleAvailability(product.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }) },
  })

  return (
    <>
      <div className={`bg-white border rounded-2xl p-4 space-y-2 ${!product.isAvailable ? 'opacity-60' : 'border-stone-100'}`}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-20 object-cover rounded-xl" loading="lazy" />
        ) : (
          <div className="w-full h-16 bg-brand-50 rounded-xl flex items-center justify-center text-2xl">
            {catCfg.icon}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-stone-800 line-clamp-2">{product.name}</p>
          <p className="text-xs text-stone-400">{catCfg.label}</p>
          <p className="text-sm font-bold text-brand-900 mt-0.5">{formatCurrency(product.price)}</p>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => toggleAvail()}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold active:scale-95 transition-all ${
              product.isAvailable ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {product.isAvailable ? '✓ Disponible' : 'Oculto'}
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="px-3 py-1.5 bg-brand-50 text-brand-900 rounded-lg text-xs font-semibold active:scale-95"
          >
            Editar
          </button>
        </div>
      </div>

      <ProductoFormModal isOpen={showEdit} onClose={() => setShowEdit(false)} product={product} />
    </>
  )
}

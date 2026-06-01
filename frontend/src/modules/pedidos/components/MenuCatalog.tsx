import { useState } from 'react'
import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { useProducts } from '../../../hooks/useProducts'
import ProductCard from './ProductCard'
import Spinner from '../../../components/ui/Spinner'
import type { ProductCategory } from '../../../types'

interface CartItem { productId: string; qty: number }

interface MenuCatalogProps {
  cart: CartItem[]
  onAdd: (productId: string) => void
  onRemove: (productId: string) => void
}

const CATS: (ProductCategory | 'all')[] = ['all', 'entrada', 'plato_principal', 'bebida', 'postre', 'especial']

export default function MenuCatalog({ cart, onAdd, onRemove }: MenuCatalogProps) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState<ProductCategory | 'all'>('all')

  const { data: products = [], isLoading } = useProducts(cat === 'all' ? undefined : cat, true)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      {/* Buscador */}
      <div className="px-5 pb-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos…"
            className="w-full pl-9 pr-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Tabs de categorías */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                cat === c ? 'bg-brand-900 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {c === 'all' ? '🍽️' : CATEGORY_CONFIG[c].icon}
              {c === 'all' ? 'Todos' : CATEGORY_CONFIG[c].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="px-5 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-stone-400 py-8 text-sm">Sin productos</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => {
              const qty = cart.find((c) => c.productId === p.id)?.qty ?? 0
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  qty={qty}
                  onAdd={() => onAdd(p.id)}
                  onRemove={() => onRemove(p.id)}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import BottomSheet from '../../../components/ui/BottomSheet'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import ProductCard from './ProductCard'
import { ordersService } from '../../../services/api'
import { useProducts } from '../../../hooks/useProducts'
import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { formatCurrency } from '../../../utils/formatCurrency'
import { cn } from '../../../utils/classNames'
import type { Order, OrderItem, ProductCategory } from '../../../types'

interface CartItem { productId: string; qty: number }

interface Props {
  isOpen: boolean
  onClose: () => void
  pedido: Order
}

const CATS: (ProductCategory | 'all')[] = ['all', 'entrada', 'plato_principal', 'bebida', 'postre', 'especial']

export default function EditarPedidoSheet({ isOpen, onClose, pedido }: Props) {
  const qc = useQueryClient()

  const [activeTab, setActiveTab]   = useState<'resumen' | 'agregar'>('resumen')
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const [addedCart, setAddedCart]   = useState<CartItem[]>([])
  const [catFilter, setCatFilter]   = useState<ProductCategory | 'all'>('all')
  const [search, setSearch]         = useState('')
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)

  const { data: products = [], isLoading: loadingProducts } = useProducts(
    catFilter === 'all' ? undefined : catFilter,
    true,
  )

  // Reiniciar estado al abrir/cerrar
  useEffect(() => {
    if (isOpen) {
      setRemovedIds(new Set())
      setAddedCart([])
      setActiveTab('resumen')
      setCatFilter('all')
      setSearch('')
      setErrorMsg(null)
    }
  }, [isOpen])

  // ─── Cálculos ────────────────────────────────────────────────
  const itemsActuales = pedido.items.filter((i) => !removedIds.has(i.id))

  const totalActual = itemsActuales.reduce((s, i) => s + i.subtotal, 0)

  const totalAgregado = addedCart.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId)
    return sum + (p?.price ?? 0) * c.qty
  }, 0)

  const nuevoTotal = totalActual + totalAgregado

  const totalNuevosItems = addedCart.reduce((s, c) => s + c.qty, 0)
  const hasChanges = removedIds.size > 0 || addedCart.length > 0

  // ─── Acciones sobre ítems actuales ───────────────────────────
  const toggleRemoveItem = (item: OrderItem) => {
    setErrorMsg(null)
    const next = new Set(removedIds)
    if (next.has(item.id)) {
      next.delete(item.id)
    } else {
      if (itemsActuales.length <= 1 && addedCart.length === 0) {
        setErrorMsg('El pedido debe tener al menos un ítem')
        return
      }
      next.add(item.id)
    }
    setRemovedIds(next)
  }

  // ─── Acciones sobre productos a agregar ──────────────────────
  const addToCart = (productId: string) => {
    setAddedCart((prev) => {
      const ex = prev.find((c) => c.productId === productId)
      return ex
        ? prev.map((c) => c.productId === productId ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { productId, qty: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setAddedCart((prev) =>
      prev.map((c) => c.productId === productId ? { ...c, qty: Math.max(0, c.qty - 1) } : c)
          .filter((c) => c.qty > 0)
    )
  }

  // ─── Guardar ─────────────────────────────────────────────────
  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      for (const itemId of removedIds) {
        await ordersService.removeItem(pedido.id, itemId)
      }
      for (const { productId, qty } of addedCart) {
        await ordersService.addItem(pedido.id, { productId, quantity: qty })
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      onClose()
    },
    onError: () => setErrorMsg('No se pudieron guardar los cambios. Intenta de nuevo.'),
  })

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // ─── Render ──────────────────────────────────────────────────
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Editar pedido"
      footer={
        <div className="space-y-2">
          {errorMsg && (
            <p className="text-xs text-red-500 text-center px-2">{errorMsg}</p>
          )}
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-stone-400">Nuevo total</span>
            <span className="font-bold text-brand-900 text-base">{formatCurrency(nuevoTotal)}</span>
          </div>
          <Button
            fullWidth
            size="lg"
            isLoading={isPending}
            disabled={!hasChanges || isPending}
            onClick={() => save()}
          >
            {hasChanges
              ? `Guardar cambios${removedIds.size > 0 ? ` · ${removedIds.size} eliminado${removedIds.size > 1 ? 's' : ''}` : ''}${totalNuevosItems > 0 ? ` · ${totalNuevosItems} nuevo${totalNuevosItems > 1 ? 's' : ''}` : ''}`
              : 'Sin cambios'}
          </Button>
        </div>
      }
    >
      {/* Selector de pestaña */}
      <div className="flex bg-stone-100 rounded-xl p-1 mb-4 gap-1">
        <button
          onClick={() => setActiveTab('resumen')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'resumen' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400',
          )}
        >
          📋 Pedido actual
          {removedIds.size > 0 && (
            <span className="ml-1 inline-flex items-center justify-center bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full">
              {removedIds.size}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('agregar')}
          className={cn(
            'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'agregar' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400',
          )}
        >
          ➕ Agregar
          {totalNuevosItems > 0 && (
            <span className="ml-1 inline-flex items-center justify-center bg-brand-900 text-white text-[9px] font-bold w-4 h-4 rounded-full">
              {totalNuevosItems}
            </span>
          )}
        </button>
      </div>

      {/* ─── Tab: Pedido actual ─────────────────────────────── */}
      {activeTab === 'resumen' && (
        <div className="space-y-2">
          {pedido.items.map((item) => {
            const isRemoved = removedIds.has(item.id)
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border transition-all',
                  isRemoved
                    ? 'border-red-200 bg-red-50'
                    : 'border-stone-100 bg-white',
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    isRemoved ? 'line-through text-stone-400' : 'text-stone-800',
                  )}>
                    {item.quantity}× {item.product.name}
                  </p>
                  {item.notes && !isRemoved && (
                    <p className="text-[10px] text-stone-400 truncate">{item.notes}</p>
                  )}
                  <p className={cn('text-xs mt-0.5', isRemoved ? 'text-red-400' : 'text-stone-400')}>
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>

                <button
                  onClick={() => toggleRemoveItem(item)}
                  className={cn(
                    'min-w-9 min-h-9 flex items-center justify-center rounded-xl transition-colors shrink-0',
                    isRemoved
                      ? 'bg-red-100 text-red-500 active:bg-red-200'
                      : 'text-stone-300 active:bg-stone-100 active:text-red-400',
                  )}
                  aria-label={isRemoved ? 'Restaurar ítem' : 'Eliminar ítem'}
                >
                  {isRemoved ? (
                    // Ícono "deshacer" cuando está marcado para eliminar
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  ) : (
                    // Ícono trash
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}

          {/* Resumen de nuevos ítems en cola */}
          {addedCart.length > 0 && (
            <div className="mt-3 pt-3 border-t border-dashed border-stone-200">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
                Por agregar
              </p>
              {addedCart.map((c) => {
                const p = products.find((x) => x.id === c.productId)
                return (
                  <div
                    key={c.productId}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl mb-1"
                  >
                    <span className="flex-1 text-xs font-medium text-green-800 truncate">
                      +{c.qty}× {p?.name ?? '…'}
                    </span>
                    <span className="text-xs text-green-600">
                      {p ? formatCurrency(p.price * c.qty) : ''}
                    </span>
                    <button
                      onClick={() => setAddedCart((prev) => prev.filter((x) => x.productId !== c.productId))}
                      className="text-green-400 active:text-red-500 p-1"
                      aria-label="Quitar del carrito"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Agregar productos ─────────────────────────── */}
      {activeTab === 'agregar' && (
        <div>
          {/* Buscador */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto…"
              className="w-full pl-9 pr-4 py-2.5 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filtro de categorías */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={cn(
                  'shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95',
                  catFilter === c ? 'bg-brand-900 text-white' : 'bg-stone-100 text-stone-600',
                )}
              >
                {c === 'all' ? '🍽️ Todos' : `${CATEGORY_CONFIG[c].icon} ${CATEGORY_CONFIG[c].label}`}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          {loadingProducts ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-stone-400 py-8 text-sm">Sin productos</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((p) => {
                const qty = addedCart.find((c) => c.productId === p.id)?.qty ?? 0
                return (
                  <ProductCard
                    key={p.id}
                    product={p}
                    qty={qty}
                    onAdd={() => addToCart(p.id)}
                    onRemove={() => removeFromCart(p.id)}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  )
}

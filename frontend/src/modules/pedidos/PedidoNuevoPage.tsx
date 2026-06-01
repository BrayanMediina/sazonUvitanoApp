import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Layout from '../../components/layout/Layout'
import MenuCatalog from './components/MenuCatalog'
import OrderCart from './components/OrderCart'
import { useProducts } from '../../hooks/useProducts'
import { ordersService } from '../../services/api'
import { formatCurrency } from '../../utils/formatCurrency'

interface CartItem { productId: string; qty: number }

export default function PedidoNuevoPage() {
  const [params]  = useSearchParams()
  const navigate  = useNavigate()
  const mesaId    = params.get('mesa') ?? undefined

  const [cart, setCart]       = useState<CartItem[]>([])
  const [notes, setNotes]     = useState('')
  const [showCart, setShowCart] = useState(false)

  const { data: products = [] } = useProducts()

  const totalItems = cart.reduce((s, c) => s + c.qty, 0)
  const total      = cart.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId)
    return sum + (p?.price ?? 0) * c.qty
  }, 0)

  const addItem = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId)
      return existing
        ? prev.map((c) => c.productId === productId ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { productId, qty: 1 }]
    })
  }

  const removeItem = (productId: string) => {
    setCart((prev) =>
      prev.map((c) => c.productId === productId ? { ...c, qty: Math.max(0, c.qty - 1) } : c)
          .filter((c) => c.qty > 0)
    )
  }

  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: () =>
      ordersService.create({
        type: mesaId ? 'mesa' : 'domicilio',
        tableId: mesaId,
        items: cart.filter((c) => c.qty > 0).map((c) => ({ productId: c.productId, quantity: c.qty })),
        notes: notes || undefined,
      }),
    onSuccess: (order) => {
      navigate(`/pedidos/${order.id}`, { replace: true })
    },
  })

  return (
    <Layout showBack title={mesaId ? 'Nuevo pedido' : 'Nuevo pedido'}>
      <div className="pb-24">
        <MenuCatalog cart={cart} onAdd={addItem} onRemove={removeItem} />
      </div>

      {/* FAB del carrito */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-30">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-brand-900 text-white rounded-2xl py-4 px-5 flex items-center justify-between shadow-soft active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="bg-white text-brand-900 text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
              <span className="font-semibold">Ver pedido</span>
            </div>
            <span className="font-bold">{formatCurrency(total)}</span>
          </button>
        </div>
      )}

      <OrderCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        products={products}
        notes={notes}
        onNotes={setNotes}
        onAdd={addItem}
        onRemove={removeItem}
        onConfirm={() => createOrder()}
        isSubmitting={isPending}
      />
    </Layout>
  )
}

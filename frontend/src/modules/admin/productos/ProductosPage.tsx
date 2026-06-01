import { useState } from 'react'
import Layout from '../../../components/layout/Layout'
import PageHeader from '../../../components/layout/PageHeader'
import Button from '../../../components/ui/Button'
import Spinner from '../../../components/ui/Spinner'
import EmptyState from '../../../components/ui/EmptyState'
import ProductoCard from './ProductoCard'
import ProductoFormModal from './ProductoFormModal'
import { useProducts } from '../../../hooks/useProducts'
import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import type { ProductCategory } from '../../../types'

const CATS: (ProductCategory | 'all')[] = ['all', 'entrada', 'plato_principal', 'bebida', 'postre', 'especial', 'domicilio']

export default function ProductosPage() {
  const [cat, setCat]       = useState<ProductCategory | 'all'>('all')
  const [showNew, setShowNew] = useState(false)

  const { data: products = [], isLoading } = useProducts(cat === 'all' ? undefined : cat)

  return (
    <Layout showBack title="Menú">
      <PageHeader
        title="Menú / Productos"
        actions={<Button size="sm" onClick={() => setShowNew(true)}>+ Nuevo</Button>}
      />

      {/* Tabs categorías */}
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
              {c === 'all' ? '🍽️ Todos' : `${CATEGORY_CONFIG[c].icon} ${CATEGORY_CONFIG[c].label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 pb-6">
        {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}
        {!isLoading && products.length === 0 && (
          <EmptyState icon="🍽️" title="Sin productos" description="Crea el primer producto del menú" />
        )}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => <ProductoCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <ProductoFormModal isOpen={showNew} onClose={() => setShowNew(false)} />
    </Layout>
  )
}

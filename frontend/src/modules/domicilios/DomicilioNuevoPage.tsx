import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Layout from '../../components/layout/Layout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import MenuCatalog from '../pedidos/components/MenuCatalog'
import OrderItemRow from '../pedidos/components/OrderItemRow'
import { deliveriesService } from '../../services/api'
import { useProducts } from '../../hooks/useProducts'
import { formatCurrency } from '../../utils/formatCurrency'

interface CartItem { productId: string; qty: number }

const clienteSchema = z.object({
  customerName:  z.string().min(2, 'Nombre requerido'),
  customerPhone: z.string().min(7, 'Teléfono requerido'),
  street:        z.string().min(5, 'Dirección requerida'),
  neighborhood:  z.string().optional(),
  reference:     z.string().optional(),
})

type ClienteData = z.infer<typeof clienteSchema>

export default function DomicilioNuevoPage() {
  const navigate  = useNavigate()
  const [step, setStep]   = useState(1)
  const [cart, setCart]   = useState<CartItem[]>([])
  const { data: products = [] } = useProducts()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ClienteData>({
    resolver: zodResolver(clienteSchema),
  })

  const addItem    = (id: string) => setCart((prev) => {
    const ex = prev.find((c) => c.productId === id)
    return ex ? prev.map((c) => c.productId === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { productId: id, qty: 1 }]
  })
  const removeItem = (id: string) => setCart((prev) =>
    prev.map((c) => c.productId === id ? { ...c, qty: Math.max(0, c.qty - 1) } : c).filter((c) => c.qty > 0)
  )

  const total = cart.reduce((sum, c) => {
    const p = products.find((x) => x.id === c.productId)
    return sum + (p?.price ?? 0) * c.qty
  }, 0)

  const { mutate: create, isPending } = useMutation({
    mutationFn: () => {
      const data = getValues()
      return deliveriesService.create({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        street: data.street,
        neighborhood: data.neighborhood,
        reference: data.reference,
        items: cart.map((c) => ({ productId: c.productId, quantity: c.qty })),
      })
    },
    onSuccess: () => navigate('/domicilios', { replace: true }),
  })

  return (
    <Layout showBack title="Nuevo domicilio">
      {/* Stepper */}
      <div className="px-5 pt-4 mb-5">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s <= step ? 'bg-brand-900 text-white' : 'bg-stone-200 text-stone-400'
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-px mx-1 ${s < step ? 'bg-brand-900' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-stone-400">
          <span>Cliente</span><span>Productos</span><span>Resumen</span>
        </div>
      </div>

      {/* Paso 1: datos del cliente */}
      {step === 1 && (
        <form onSubmit={handleSubmit(() => setStep(2))} className="px-5 space-y-4">
          <Input label="Nombre del cliente" placeholder="Nombre completo" error={errors.customerName?.message} {...register('customerName')} />
          <Input label="Teléfono" type="tel" placeholder="+57 300 000 0000" error={errors.customerPhone?.message} {...register('customerPhone')} />
          <Input label="Dirección" placeholder="Cra/Calle + número" error={errors.street?.message} {...register('street')} />
          <Input label="Barrio (opcional)" placeholder="Barrio" {...register('neighborhood')} />
          <Input label="Referencia (opcional)" placeholder="Casa de dos pisos, portón azul…" {...register('reference')} />
          <Button type="submit" fullWidth size="lg">Continuar</Button>
        </form>
      )}

      {/* Paso 2: productos */}
      {step === 2 && (
        <div>
          <MenuCatalog cart={cart} onAdd={addItem} onRemove={removeItem} />
          <div className="px-5 pt-4 pb-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Atrás</Button>
            <Button onClick={() => setStep(3)} disabled={cart.length === 0} className="flex-1">
              Continuar ({cart.reduce((s, c) => s + c.qty, 0)} ítems)
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3: resumen */}
      {step === 3 && (
        <div className="px-5 space-y-4 pb-6">
          <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-1 text-sm">
            <p className="font-semibold text-stone-800 mb-2">Datos del cliente</p>
            <p className="text-stone-600">👤 {getValues('customerName')}</p>
            <p className="text-stone-600">📞 {getValues('customerPhone')}</p>
            <p className="text-stone-600">📍 {getValues('street')}</p>
          </div>
          <div className="bg-white border border-stone-100 rounded-2xl p-4">
            <p className="font-semibold text-stone-800 mb-3">Productos</p>
            {cart.map((c) => {
              const p = products.find((x) => x.id === c.productId)
              if (!p) return null
              return <OrderItemRow key={c.productId} product={p} qty={c.qty} readonly />
            })}
            <div className="flex justify-between pt-3 border-t border-stone-100 mt-2">
              <p className="font-semibold">Total</p>
              <p className="font-bold text-brand-900">{formatCurrency(total)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Atrás</Button>
            <Button onClick={() => create()} isLoading={isPending} className="flex-1">Crear domicilio</Button>
          </div>
        </div>
      )}
    </Layout>
  )
}

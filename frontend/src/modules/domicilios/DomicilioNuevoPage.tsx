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
  street:        z.string().min(3, 'Dirección requerida'),
  neighborhood:  z.string().optional(),
  reference:     z.string().optional(),
})

type ClienteData = z.infer<typeof clienteSchema>

const STEPS = ['Cliente', 'Productos', 'Resumen']

export default function DomicilioNuevoPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [cart, setCart] = useState<CartItem[]>([])
  const { data: products = [] } = useProducts()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ClienteData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      customerPhone: '+57 ',
      neighborhood:  'Centro',
    },
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

  const { mutate: create, isPending, isError } = useMutation({
    mutationFn: () => {
      const data = getValues()
      return deliveriesService.create({
        customerName:  data.customerName,
        customerPhone: data.customerPhone,
        street:        data.street,
        neighborhood:  data.neighborhood || 'Centro',
        reference:     data.reference,
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
          {STEPS.map((_label, i) => {
            const s = i + 1
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-1.5">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s < step ? 'bg-brand-900 text-white' : s === step ? 'bg-brand-900 text-white ring-4 ring-brand-200' : 'bg-stone-200 text-stone-400'
                  }`}>
                    {s < step ? (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : s}
                  </div>
                </div>
                {s < STEPS.length && (
                  <div className={`flex-1 h-px mx-2 transition-all ${s < step ? 'bg-brand-900' : 'bg-stone-200'}`} />
                )}
              </div>
            )
          })}
        </div>
        <div className="flex mt-1.5 text-[10px] text-stone-400">
          {STEPS.map((label, i) => (
            <span key={i} className={`flex-1 ${i < STEPS.length - 1 ? '' : 'text-right'} ${i + 1 === step ? 'text-brand-900 font-semibold' : ''}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Paso 1: datos del cliente ── */}
      {step === 1 && (
        <form onSubmit={handleSubmit(() => setStep(2))} className="px-5 space-y-4 pb-6">
          {/* Zona del servicio — referencia informativa */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <span className="text-sm">📍</span>
            <p className="text-xs text-amber-800 font-medium">Zona de entrega: <span className="font-bold">La Uvita, Boyacá</span></p>
          </div>

          <Input
            label="Nombre del cliente"
            placeholder="Ej. María García"
            error={errors.customerName?.message}
            {...register('customerName')}
          />

          {/* Teléfono con prefijo +57 fijo */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Teléfono</label>
            <div className="flex gap-2 items-start">
              <div className="flex items-center h-11 px-3 bg-stone-100 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 shrink-0 select-none">
                🇨🇴 +57
              </div>
              <div className="flex-1">
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="300 000 0000"
                  error={errors.customerPhone?.message}
                  {...register('customerPhone', {
                    onChange: (e) => {
                      // Mantener siempre el prefijo +57
                      if (!e.target.value.startsWith('+57')) {
                        e.target.value = '+57 ' + e.target.value.replace(/^\+57\s?/, '')
                      }
                    },
                  })}
                />
              </div>
            </div>
          </div>

          <Input
            label="Dirección"
            placeholder="Cra 5 #10-20, frente al parque"
            error={errors.street?.message}
            {...register('street')}
          />

          <Input
            label="Barrio"
            placeholder="Centro"
            {...register('neighborhood')}
          />

          <Input
            label="Referencia (opcional)"
            placeholder="Casa roja, portón verde…"
            {...register('reference')}
          />

          <Button type="submit" fullWidth size="lg">
            Continuar → Productos
          </Button>
        </form>
      )}

      {/* ── Paso 2: productos ── */}
      {step === 2 && (
        <div>
          <MenuCatalog cart={cart} onAdd={addItem} onRemove={removeItem} />
          <div className="px-5 pt-4 pb-6 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Atrás</Button>
            <Button onClick={() => setStep(3)} disabled={cart.length === 0} className="flex-1">
              Ver resumen ({cart.reduce((s, c) => s + c.qty, 0)})
            </Button>
          </div>
        </div>
      )}

      {/* ── Paso 3: resumen ── */}
      {step === 3 && (
        <div className="px-5 space-y-4 pb-8">
          {/* Datos del cliente */}
          <div className="bg-white border border-stone-100 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Cliente</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400">👤</span>
              <span className="text-stone-700 font-medium">{getValues('customerName')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400">📞</span>
              <span className="text-stone-700">{getValues('customerPhone')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400">📍</span>
              <span className="text-stone-700">
                {getValues('street')}
                {getValues('neighborhood') ? `, ${getValues('neighborhood')}` : ''}
              </span>
            </div>
            {getValues('reference') && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-stone-400">🏠</span>
                <span className="text-stone-500 italic">{getValues('reference')}</span>
              </div>
            )}
            <p className="text-xs text-stone-400 pt-1">La Uvita, Boyacá</p>
          </div>

          {/* Productos */}
          <div className="bg-white border border-stone-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Productos</p>
            {cart.map((c) => {
              const p = products.find((x) => x.id === c.productId)
              if (!p) return null
              return <OrderItemRow key={c.productId} product={p} qty={c.qty} readonly />
            })}
            <div className="flex justify-between pt-3 border-t border-stone-100 mt-2">
              <p className="font-semibold text-stone-800">Total</p>
              <p className="text-lg font-bold text-brand-900">{formatCurrency(total)}</p>
            </div>
          </div>

          {isError && (
            <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl p-3">
              Error al crear el domicilio. Intenta de nuevo.
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Atrás</Button>
            <Button onClick={() => create()} isLoading={isPending} className="flex-1">
              Crear domicilio
            </Button>
          </div>
        </div>
      )}
    </Layout>
  )
}

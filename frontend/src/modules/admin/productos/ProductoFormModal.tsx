import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import { CATEGORY_CONFIG } from '../../../constants/orderStatus'
import { productsService } from '../../../services/api'
import type { Product, ProductCategory } from '../../../types'

const schema = z.object({
  name:        z.string().min(2),
  description: z.string().optional(),
  price:       z.coerce.number().positive(),
  category:    z.enum(['entrada','plato_principal','bebida','postre','especial','domicilio'] as const),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  isAvailable: z.boolean(),
})
type FormData = z.infer<typeof schema>

interface ProductoFormModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
}

export default function ProductoFormModal({ isOpen, onClose, product }: ProductoFormModalProps) {
  const qc = useQueryClient()
  const isEdit = !!product

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'plato_principal', isAvailable: true },
  })

  useEffect(() => {
    if (product) {
      reset({ name: product.name, description: product.description ?? '', price: product.price, category: product.category, imageUrl: product.imageUrl ?? '', isAvailable: product.isAvailable })
    } else {
      reset({ category: 'plato_principal', isAvailable: true })
    }
  }, [product, reset])

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => isEdit
      ? productsService.update(product!.id, { ...data, imageUrl: data.imageUrl || undefined })
      : productsService.create({ ...data, imageUrl: data.imageUrl || undefined, isActive: true }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); onClose() },
  })

  const catOptions = (Object.keys(CATEGORY_CONFIG) as ProductCategory[]).map((k) => ({
    value: k,
    label: `${CATEGORY_CONFIG[k].icon} ${CATEGORY_CONFIG[k].label}`,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar producto' : 'Nuevo producto'}
      footer={
        <Button fullWidth isLoading={isSubmitting} onClick={handleSubmit((d) => mutate(d))}>
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      }
    >
      <form className="space-y-3">
        <Input label="Nombre" {...register('name')} error={errors.name?.message} />
        <Input label="Descripción (opcional)" {...register('description')} />
        <Input label="Precio (COP)" type="number" inputMode="numeric" {...register('price')} error={errors.price?.message} />
        <Select label="Categoría" options={catOptions} {...register('category')} />
        <Input label="URL de imagen (opcional)" type="url" {...register('imageUrl')} error={errors.imageUrl?.message} />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isAvailable" {...register('isAvailable')} className="h-4 w-4 accent-brand-900" />
          <label htmlFor="isAvailable" className="text-sm text-stone-700">Disponible en el menú</label>
        </div>
      </form>
    </Modal>
  )
}

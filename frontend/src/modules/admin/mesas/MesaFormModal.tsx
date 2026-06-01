import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { tablesService } from '../../../services/api'
import type { Table } from '../../../types'

const schema = z.object({
  number:   z.coerce.number().int().positive(),
  capacity: z.coerce.number().int().positive().optional(),
  zone:     z.string().optional(),
})
type FormData = z.infer<typeof schema>

interface MesaFormModalProps {
  isOpen: boolean
  onClose: () => void
  table?: Table
}

export default function MesaFormModal({ isOpen, onClose, table }: MesaFormModalProps) {
  const qc = useQueryClient()
  const isEdit = !!table

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (table) reset({ number: table.number, capacity: table.capacity, zone: table.zone ?? '' })
    else reset({})
  }, [table, reset])

  const { mutate } = useMutation({
    mutationFn: (data: FormData) => isEdit
      ? tablesService.update(table!.id, data)
      : tablesService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tables'] }); onClose() },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar mesa' : 'Nueva mesa'}
      footer={
        <Button fullWidth isLoading={isSubmitting} onClick={handleSubmit((d) => mutate(d))}>
          {isEdit ? 'Guardar cambios' : 'Crear mesa'}
        </Button>
      }
    >
      <form className="space-y-3">
        <Input label="Número de mesa" type="number" inputMode="numeric" {...register('number')} error={errors.number?.message} />
        <Input label="Capacidad (personas)" type="number" inputMode="numeric" {...register('capacity')} />
        <Input label="Zona (ej: Terraza, Salón principal)" {...register('zone')} />
      </form>
    </Modal>
  )
}

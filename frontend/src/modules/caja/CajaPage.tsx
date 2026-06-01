import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function CajaPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Caja</h2>
          <p className="text-brand-600">Control de pagos y movimientos de caja</p>
        </div>

        <Card title="Resumen de caja">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-brand-600">Ingresos del día</p>
              <p className="text-2xl font-bold text-brand-950">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-brand-600">Transacciones</p>
              <p className="text-2xl font-bold text-brand-950">0</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

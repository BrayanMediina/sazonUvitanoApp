import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function PedidosPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Gestión de Pedidos</h2>
          <p className="text-brand-600">Visualiza y administra todos los pedidos</p>
        </div>

        <Card title="Pedidos recientes" subtitle="Últimas órdenes registradas">
          <div className="text-center py-8 text-brand-600">
            <p>No hay pedidos registrados aún</p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function MapaPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Mapa de Entregas</h2>
          <p className="text-brand-600">Visualiza ubicación de domiciliarios en tiempo real</p>
        </div>

        <Card title="Mapa">
          <div className="w-full h-96 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600">
            <p>Mapa en tiempo real</p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

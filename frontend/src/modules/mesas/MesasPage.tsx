import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function MesasPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Gestión de Mesas</h2>
          <p className="text-brand-600">Controla el estado y ocupación de cada mesa</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((table) => (
            <Card key={table} className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-center">
                <p className="text-4xl font-bold text-brand-950">Mesa {table}</p>
                <p className="text-sm text-brand-600 mt-2">Disponible</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

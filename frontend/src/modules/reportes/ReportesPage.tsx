import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function ReportesPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Reportes</h2>
          <p className="text-brand-600">Análisis y estadísticas del negocio</p>
        </div>

        <Card title="Reporte diario">
          <div className="text-center py-8 text-brand-600">
            <p>Cargando datos...</p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

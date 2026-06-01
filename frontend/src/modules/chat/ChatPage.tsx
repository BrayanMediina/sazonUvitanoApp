import { useAppStore } from '../../store'
import Layout from '../../components/Layout'
import Card from '../../components/Card'

export default function ChatPage() {
  const user = useAppStore((state) => state.user)

  return (
    <Layout userName={user?.name} userRole={user?.role}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-brand-950">Chat</h2>
          <p className="text-brand-600">Comunicación con el equipo en tiempo real</p>
        </div>

        <Card title="Conversaciones">
          <div className="text-center py-8 text-brand-600">
            <p>No hay conversaciones activas</p>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

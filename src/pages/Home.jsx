import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"
import StatsOverview from "../components/dashboard/StatsOverview"
import PaymentStatusCard from "../components/dashboard/PaymentStatusCard"

const Home = () => {
  const { clients } = useApp()

  // Actualizar estados basados en fechas actuales
  const clientsWithUpdatedStatus = clients.map((client) => ({
    ...client,
    status: membershipsService.calculateStatus(client.membershipEnd),
  }))

  // Calcular estadísticas
  const stats = {
    total: clientsWithUpdatedStatus.length,
    active: clientsWithUpdatedStatus.filter((c) => c.status === "vigente").length,
    expiring: clientsWithUpdatedStatus.filter((c) => c.status === "por_vencer").length,
    expired: clientsWithUpdatedStatus.filter((c) => c.status === "vencido").length,
  }

  return (
    <div className="space-y-6">
      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentStatusCard clients={clientsWithUpdatedStatus} />

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Ingresos del mes</span>
              <span className="text-lg font-bold text-green-600">€ 0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Nuevos este mes</span>
              <span className="text-lg font-bold text-blue-600">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Tasa de renovación</span>
              <span className="text-lg font-bold text-purple-600">0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

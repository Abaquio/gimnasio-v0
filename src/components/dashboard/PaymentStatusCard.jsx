import StatusBadge from "../ui/StatusBadge"

const PaymentStatusCard = ({ clients }) => {
  // Ordenar por fecha de vencimiento más cercana
  const sortedClients = [...clients].sort((a, b) => new Date(a.membershipEnd) - new Date(b.membershipEnd))

  // Tomar solo los próximos 5 vencimientos
  const upcomingClients = sortedClients.slice(0, 5)

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Vencimientos</h3>

      <div className="space-y-4">
        {upcomingClients.map((client) => (
          <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{client.name}</p>
              <p className="text-sm text-gray-500">
                Vence: {new Date(client.membershipEnd).toLocaleDateString("es-ES")}
              </p>
            </div>
            <StatusBadge status={client.status} />
          </div>
        ))}

        {upcomingClients.length === 0 && <p className="text-center text-gray-500 py-4">No hay vencimientos próximos</p>}
      </div>
    </div>
  )
}

export default PaymentStatusCard

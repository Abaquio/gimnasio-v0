"use client"

import { useState } from "react"
import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"
import ClientTable from "../components/clients/ClientTable"

const Clients = () => {
  const { clients, deleteClient } = useApp()
  const [searchTerm, setSearchTerm] = useState("")

  // Actualizar estados basados en fechas actuales
  const clientsWithUpdatedStatus = clients.map((client) => ({
    ...client,
    status: membershipsService.calculateStatus(client.membershipEnd),
  }))

  // Filtrar clientes por búsqueda
  const filteredClients = clientsWithUpdatedStatus.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  const handleEdit = (client) => {
    alert(`Editar cliente: ${client.name}\n(Funcionalidad pendiente)`)
  }

  const handleDelete = (client) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${client.name}?`)) {
      deleteClient(client.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="card">
        <ClientTable clients={filteredClients} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default Clients

"use client"

import { useApp } from "../../context/AppContext"
import StatusBadge from "../ui/StatusBadge"

const StaffTable = ({ searchTerm }) => {
  const { staff, deleteStaff } = useApp()

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { label: "Administrador", color: "purple" },
      entrenador: { label: "Entrenador", color: "blue" },
      recepcionista: { label: "Recepcionista", color: "green" },
    }
    return roleMap[role] || { label: role, color: "gray" }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
      deleteStaff(id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStaff.map((member) => {
              const roleBadge = getRoleBadge(member.role)
              return (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{member.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${roleBadge.color}-100 text-${roleBadge.color}-800`}
                    >
                      {roleBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={member.status === "activo" ? "vigente" : "vencido"} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron miembros del staff</p>
        </div>
      )}
    </div>
  )
}

export default StaffTable

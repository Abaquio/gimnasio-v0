// src/components/clients/ClientTable.jsx
import { memo } from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2 } from "lucide-react"
import StatusBadge from "../ui/StatusBadge"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const row = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("es-ES")
  } catch {
    return "-"
  }
}

/**
 * Props:
 *  - clients: Array<{ id, name, email, phone, status, membershipEnd }>
 *  - onEdit(client)
 *  - onDelete(client)
 */
function ClientTable({ clients = [], onEdit, onDelete }) {
  const isEmpty = !clients || clients.length === 0

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white">
      <div className="overflow-x-auto">
        <motion.table
          variants={container}
          initial="hidden"
          animate="show"
          className="min-w-full divide-y divide-gray-100"
        >
          <thead className="bg-gray-50/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Correo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                Vencimiento
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isEmpty ? (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center">
                  <p className="text-sm text-gray-600">
                    No hay clientes para mostrar.
                  </p>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <motion.tr
                  key={client.id ?? client.email}
                  variants={row}
                  className="group bg-white transition-colors hover:bg-gray-50/70"
                >
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="font-medium text-gray-900">{client.name}</div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5">
                    <a
                      className="text-sm text-primary-600 underline-offset-2 hover:underline"
                      href={`mailto:${client.email}`}
                    >
                      {client.email}
                    </a>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
                    {client.phone || "-"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5">
                    <StatusBadge status={client.status} />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-gray-700">
                    {formatDate(client.membershipEnd)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(client)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label={`Editar ${client.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(client)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label={`Eliminar ${client.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </motion.table>
      </div>
    </div>
  )
}

export default memo(ClientTable)
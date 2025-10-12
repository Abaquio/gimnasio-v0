import Table from "../ui/Table"
import StatusBadge from "../ui/StatusBadge"

const ClientTable = ({ clients, onEdit, onDelete }) => {
  const columns = [
    { key: "name", label: "Nombre" },
    { key: "email", label: "Correo" },
    { key: "phone", label: "Teléfono" },
    {
      key: "status",
      label: "Estado",
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: "membershipEnd",
      label: "Vencimiento",
      render: (date) => new Date(date).toLocaleDateString("es-ES"),
    },
  ]

  return <Table columns={columns} data={clients} onEdit={onEdit} onDelete={onDelete} />
}

export default ClientTable

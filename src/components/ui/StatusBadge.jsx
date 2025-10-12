const StatusBadge = ({ status }) => {
  const statusConfig = {
    vigente: {
      label: "Vigente",
      classes: "bg-green-100 text-green-800 border-green-200",
    },
    por_vencer: {
      label: "Por Vencer",
      classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    vencido: {
      label: "Vencido",
      classes: "bg-red-100 text-red-800 border-red-200",
    },
  }

  const config = statusConfig[status] || statusConfig.vencido

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge

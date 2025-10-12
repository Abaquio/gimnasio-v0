const StatsCard = ({ title, value, icon, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary-100 text-primary-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  )
}

export default StatsCard

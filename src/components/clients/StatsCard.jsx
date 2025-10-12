// src/components/StatsCard.jsx
import { motion } from "framer-motion"
import { Users, Check, AlertTriangle, X } from "lucide-react"

const icons = {
  total: Users,
  active: Check,
  warning: AlertTriangle,
  expired: X,
}

/**
 * Props esperadas:
 *  - title: string (ej: "Activos")
 *  - value: number (ej: 4)
 *  - type: "total" | "active" | "warning" | "expired"
 */
export default function StatsCard({ title, value, type = "total" }) {
  const Icon = icons[type] || Users

  const colors = {
    total: "text-blue-600 bg-blue-50 border-blue-100",
    active: "text-green-600 bg-green-50 border-green-100",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-100",
    expired: "text-red-600 bg-red-50 border-red-100",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="flex flex-col items-center justify-center rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colors[type]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-3 text-sm text-gray-500 font-medium">{title}</p>
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="mt-1 text-2xl font-semibold text-gray-900"
      >
        {value}
      </motion.span>
    </motion.div>
  )
}
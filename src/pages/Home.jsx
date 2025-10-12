"use client"

import { motion } from "framer-motion"
import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"
import StatsOverview from "../components/dashboard/StatsOverview"
import PaymentStatusCard from "../components/dashboard/PaymentStatusCard"

// Variantes de animación
const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.1 },
  },
}

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut", delay } },
})

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
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Bloque superior con tarjetas de métricas */}
      <motion.div variants={fadeIn(0)}>
        <StatsOverview stats={stats} />
      </motion.div>

      {/* Grid de tarjetas inferiores */}
      <motion.div
        variants={fadeIn(0.15)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Estado de pagos */}
        <motion.div
          variants={fadeIn(0.2)}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <PaymentStatusCard clients={clientsWithUpdatedStatus} />
        </motion.div>

        {/* Resumen rápido */}
        <motion.div
          variants={fadeIn(0.25)}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Rápido
          </h3>
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                Ingresos del mes
              </span>
              <span className="text-lg font-bold text-green-600">$ 0</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                Nuevos este mes
              </span>
              <span className="text-lg font-bold text-blue-600">0</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="flex justify-between items-center p-3 bg-purple-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                Tasa de renovación
              </span>
              <span className="text-lg font-bold text-purple-600">0%</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Home
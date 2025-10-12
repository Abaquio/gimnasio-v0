"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"
import ClientForm from "../components/clients/ClientForm"
import MembershipForm from "../components/clients/MembershipForm"

// Variantes de animación
const container = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
  },
}

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut", delay } },
})

export default function ClientNew() {
  const navigate = useNavigate()
  const { addClient } = useApp()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipStart: new Date().toISOString().split("T")[0],
    membershipEnd: "",
    paymentMethod: "",
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.membershipStart) newErrors.membershipStart = "La fecha de inicio es requerida"
    if (!formData.paymentMethod) newErrors.paymentMethod = "El medio de pago es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const status = membershipsService.calculateStatus(formData.membershipEnd)
    const newClient = { ...formData, status }

    addClient(newClient)
    navigate("/clients")
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Título animado */}
      <motion.h2
        className="text-2xl font-semibold text-gray-900 mb-6"
        variants={fadeIn(0)}
      >
        Nuevo Cliente
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={fadeIn(0.05)}
      >
        {/* Datos del Cliente */}
        <motion.div variants={fadeIn(0.1)} className="card shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Datos del Cliente
          </h3>
          <ClientForm formData={formData} onChange={setFormData} errors={errors} />
        </motion.div>

        {/* Datos de Membresía */}
        <motion.div variants={fadeIn(0.15)} className="card shadow-sm hover:shadow-md transition-shadow">
          <MembershipForm formData={formData} onChange={setFormData} errors={errors} />
        </motion.div>

        {/* Botones */}
        <motion.div
          variants={fadeIn(0.25)}
          className="flex items-center justify-end gap-4 pt-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => navigate("/clients")}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Guardar Cliente
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
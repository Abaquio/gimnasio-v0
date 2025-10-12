"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { useApp } from "../context/AppContext"
import FormField from "../components/ui/FormField"

const container = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 } },
}
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut", delay } },
})

export default function Profile() {
  const { user, updateUser } = useApp()
  const [formData, setFormData] = useState({ name: user.name, email: user.email })
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!formData.email.trim()) newErrors.email = "El correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Correo inválido"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    updateUser(formData)
    setIsEditing(false)
    alert("Perfil actualizado correctamente")
  }

  const handleCancel = () => {
    setFormData({ name: user.name, email: user.email })
    setErrors({})
    setIsEditing(false)
  }

  return (
    <motion.div className="max-w-2xl mx-auto space-y-6" variants={container} initial="hidden" animate="show">
      {/* Tarjeta principal */}
      <motion.div variants={fadeIn(0)} className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Información del Perfil</h3>

          {/* Acciones en el header: SIEMPRE visibles */}
          {!isEditing ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Editar Perfil
            </motion.button>
          ) : (
            <div className="flex gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCancel}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                form="profile-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Guardar Cambios
              </motion.button>
            </div>
          )}
        </div>

        <motion.form id="profile-form" onSubmit={handleSubmit} className="space-y-6" variants={fadeIn(0.05)}>
          <motion.div variants={fadeIn(0.1)} className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <motion.img
              key={user.avatar}
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
              className="w-24 h-24 rounded-full shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <div>
              <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeIn(0.15)}>
            <FormField label="Nombre completo" required error={errors.name}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                }`}
              />
            </FormField>
          </motion.div>

          <motion.div variants={fadeIn(0.2)}>
            <FormField label="Correo electrónico" required error={errors.email}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition ${
                  !isEditing ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                }`}
              />
            </FormField>
          </motion.div>

        </motion.form>
      </motion.div>

      {/* Información del sistema */}
      <motion.div variants={fadeIn(0.3)} whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <motion.div variants={fadeIn(0.35)} className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium text-gray-900">Plan Esencial</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Versión:</span>
            <span className="font-medium text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Última actualización:</span>
            <span className="font-medium text-gray-900">Enero 2025</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
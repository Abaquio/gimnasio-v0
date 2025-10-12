"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../../context/AppContext"
import FormField from "../ui/FormField"

const StaffForm = () => {
  const navigate = useNavigate()
  const { addStaff } = useApp()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "recepcionista",
    status: "activo",
  })

  const [errors, setErrors] = useState({})

  // Manejo de cambios en campos
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Validar campos requeridos
  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "El nombre es requerido."
    if (!formData.email.trim()) newErrors.email = "El correo es requerido."
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Ingresa un correo válido."
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido."
    if (!formData.role) newErrors.role = "El rol es obligatorio."
    if (!formData.status) newErrors.status = "El estado es obligatorio."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    addStaff(formData)
    navigate("/staff")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Información del Staff
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <FormField label="Nombre completo" required error={errors.name}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Carlos Rodríguez"
              autoComplete="name"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm`}
            />
          </FormField>

          {/* Correo */}
          <FormField label="Correo electrónico" required error={errors.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@gymadmin.com"
              autoComplete="email"
              inputMode="email"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm`}
            />
          </FormField>

          {/* Teléfono */}
          <FormField label="Teléfono" required error={errors.phone}>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+34 612 345 678"
              autoComplete="tel"
              inputMode="tel"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm`}
            />
          </FormField>

          {/* Rol */}
          <FormField label="Rol" required error={errors.role}>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full appearance-none bg-white px-4 pr-10 py-2 rounded-lg border ${
                  errors.role ? "border-red-500" : "border-gray-300"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm`}
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="entrenador">Entrenador</option>
                <option value="admin">Administrador</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </FormField>

          {/* Estado */}
          <FormField label="Estado" required error={errors.status}>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full appearance-none bg-white px-4 pr-10 py-2 rounded-lg border ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition shadow-sm`}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </FormField>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          Guardar Staff
        </button>
        <button
          type="button"
          onClick={() => navigate("/staff")}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default StaffForm
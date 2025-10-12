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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addStaff(formData)
    navigate("/staff")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Staff</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nombre completo"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Carlos Rodríguez"
          />

          <FormField
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="correo@gymadmin.com"
          />

          <FormField
            label="Teléfono"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+34 612 345 678"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            >
              <option value="recepcionista">Recepcionista</option>
              <option value="entrenador">Entrenador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              required
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Guardar Staff
        </button>
        <button
          type="button"
          onClick={() => navigate("/staff")}
          className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default StaffForm

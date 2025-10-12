"use client"

import { useState } from "react"
import { useApp } from "../context/AppContext"
import FormField from "../components/ui/FormField"

const Profile = () => {
  const { user, updateUser } = useApp()
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
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
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Información del Perfil</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn-primary">
              Editar Perfil
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-200">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-24 h-24 rounded-full" />
            <div>
              <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          <FormField label="Nombre completo" required error={errors.name}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
            />
          </FormField>

          <FormField label="Correo electrónico" required error={errors.email}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
            />
          </FormField>

          {isEditing && (
            <div className="flex items-center justify-end gap-4 pt-4">
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Guardar Cambios
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <div className="space-y-3 text-sm">
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
        </div>
      </div>
    </div>
  )
}

export default Profile

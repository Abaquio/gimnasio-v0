"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"
import ClientForm from "../components/clients/ClientForm"
import MembershipForm from "../components/clients/MembershipForm"

const ClientNew = () => {
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

    if (!validate()) {
      return
    }

    // Calcular estado basado en fecha de vencimiento
    const status = membershipsService.calculateStatus(formData.membershipEnd)

    const newClient = {
      ...formData,
      status,
    }

    addClient(newClient)
    navigate("/clients")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
          <ClientForm formData={formData} onChange={setFormData} errors={errors} />
        </div>

        <div className="card">
          <MembershipForm formData={formData} onChange={setFormData} errors={errors} />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => navigate("/clients")} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientNew

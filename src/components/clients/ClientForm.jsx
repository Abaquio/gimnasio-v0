"use client"

import FormField from "../ui/FormField"

const ClientForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <div className="space-y-4">
      <FormField label="Nombre completo" required error={errors?.name}>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Ej: Juan Pérez"
        />
      </FormField>

      <FormField label="Correo electrónico" required error={errors?.email}>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="ejemplo@correo.com"
        />
      </FormField>

      <FormField label="Teléfono" required error={errors?.phone}>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="+34 612 345 678"
        />
      </FormField>
    </div>
  )
}

export default ClientForm

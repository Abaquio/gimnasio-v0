"use client"

import FormField from "../ui/FormField"

const ClientForm = ({ formData, onChange, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  return (
    <div className="space-y-4">
      <FormField label="Nombre completo" required error={errors.name}>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          autoComplete="name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
      </FormField>

      <FormField label="Correo electrónico" required error={errors.email}>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          autoComplete="email"
          inputMode="email"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
      </FormField>

      <FormField label="Teléfono" required error={errors.phone}>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          placeholder="+56 9 1234 5678"
          autoComplete="tel"
          inputMode="tel"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
      </FormField>
    </div>
  )
}

export default ClientForm
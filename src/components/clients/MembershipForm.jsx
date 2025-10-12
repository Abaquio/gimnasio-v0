"use client"

import { useEffect } from "react"
import FormField from "../ui/FormField"
import { membershipsService } from "../../services/membershipsService"

const MembershipForm = ({ formData, onChange, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ ...formData, [name]: value })
  }

  // Calcular automáticamente la fecha de vencimiento cuando cambia la fecha de inicio
  useEffect(() => {
    if (formData.membershipStart) {
      const endDate = membershipsService.calculateEndDate(formData.membershipStart)
      onChange({ ...formData, membershipEnd: endDate })
    }
  }, [formData.membershipStart])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Mensualidad Inicial</h3>

      <FormField label="Fecha de inicio" required error={errors?.membershipStart}>
        <input
          type="date"
          name="membershipStart"
          value={formData.membershipStart || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </FormField>

      <FormField label="Fecha de vencimiento" required error={errors?.membershipEnd}>
        <input
          type="date"
          name="membershipEnd"
          value={formData.membershipEnd || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente (30 días desde inicio)</p>
      </FormField>

      <FormField label="Medio de pago" required error={errors?.paymentMethod}>
        <select
          name="paymentMethod"
          value={formData.paymentMethod || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Seleccionar...</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="debito">Débito</option>
          <option value="credito">Crédito</option>
        </select>
      </FormField>
    </div>
  )
}

export default MembershipForm

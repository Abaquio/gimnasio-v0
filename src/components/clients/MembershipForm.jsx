"use client"

import { useEffect } from "react"
import FormField from "../ui/FormField"

const paymentOptions = [
  { key: "efectivo", label: "Efectivo", emoji: "💵" },
  { key: "transferencia", label: "Transferencia", emoji: "🏦" },
  { key: "debito", label: "Débito", emoji: "💳" },
  { key: "credito", label: "Crédito", emoji: "💎" },
]

// suma N meses y resta 1 día para ciclos cerrados
function calcEndDate(startISO, months) {
  if (!startISO || !months || months <= 0) return ""
  const start = new Date(startISO + "T00:00:00")
  const d = new Date(start)
  d.setMonth(d.getMonth() + Number(months))
  d.setDate(d.getDate() - 1) // hasta el día anterior
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

const toCLP = (v) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(
    Number.isFinite(v) ? v : 0
  )

const MembershipForm = ({ plans = [], formData, onChange, errors = {} }) => {
  const set = (patch) => onChange({ ...formData, ...patch })

  const currentPlan = plans.find((p) => p.id === formData.planId) || null
  const monthsToUse = formData.monthsOverride > 0 ? Number(formData.monthsOverride) : currentPlan?.meses || 0

  // cuando cambia plan → rellenar precio por defecto si no hay override
  useEffect(() => {
    if (currentPlan && !formData.priceClp) {
      set({ priceClp: currentPlan.precio_clp })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.planId])

  // recalcular fin cuando cambie inicio, plan o monthsOverride
  useEffect(() => {
    if (formData.membershipStart && monthsToUse > 0) {
      const end = calcEndDate(formData.membershipStart, monthsToUse)
      set({ membershipEnd: end })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.membershipStart, formData.planId, formData.monthsOverride])

  // helpers de inputs
  const handleSelectPlan = (e) => {
    const planId = Number(e.target.value) || null
    // al seleccionar plan, si había monthsOverride lo mantenemos (si el usuario quiere forzar)
    // si NO hay override, tomamos precio del plan
    if (planId) {
      const p = plans.find((pl) => pl.id === planId)
      set({
        planId,
        priceClp: p ? p.precio_clp : formData.priceClp,
      })
    } else {
      set({ planId: null })
    }
  }

  const handleMonthsOverride = (e) => {
    const n = e.target.value === "" ? "" : Math.max(1, Number(e.target.value))
    set({ monthsOverride: n })
  }

  const handlePrice = (e) => {
    // almacenamos como entero CLP (sin puntos)
    const raw = e.target.value.replace(/[^\d]/g, "")
    set({ priceClp: raw === "" ? "" : Number(raw) })
  }

  const selectPayment = (key) => set({ paymentMethod: key })

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <span>💳</span> Información de Membresía
      </h3>

      {/* Plan + Precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Plan" required error={errors.planId}>
          <select
            name="planId"
            value={formData.planId || ""}
            onChange={handleSelectPlan}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          >
            <option value="">Seleccionar…</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.meses} {p.meses === 1 ? "mes" : "meses"}) — {toCLP(p.precio_clp)}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Puedes elegir un plan o definir “Meses personalizados” abajo.
          </p>
        </FormField>

        <FormField label="Precio" required error={errors.priceClp}>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              name="priceClp"
              value={formData.priceClp === "" || formData.priceClp == null ? "" : toCLP(formData.priceClp)}
              onChange={handlePrice}
              placeholder="$35.000"
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Se guarda como CLP entero (sin decimales).</p>
        </FormField>
      </div>

      {/* Meses personalizados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Meses personalizados (opcional)" error={errors.monthsOverride}>
          <input
            type="number"
            min={1}
            placeholder="Ej: 2"
            value={formData.monthsOverride ?? ""}
            onChange={handleMonthsOverride}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Si indicas un valor aquí, se usará en lugar del plan.
          </p>
        </FormField>

        <FormField label="Fecha de inicio" required error={errors.membershipStart}>
          <input
            type="date"
            name="membershipStart"
            value={formData.membershipStart || ""}
            onChange={(e) => set({ membershipStart: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </FormField>
      </div>

      <FormField label="Fecha de vencimiento" required error={errors.membershipEnd}>
        <input
          type="date"
          name="membershipEnd"
          value={formData.membershipEnd || ""}
          readOnly
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Se calcula automáticamente según el plan o los meses personalizados.
        </p>
      </FormField>

      {/* Método de pago tipo “cards” */}
      <div className="space-y-3">
        <h4 className="text-md font-semibold text-gray-900 flex items-center gap-2">
          <span>💰</span> Método de Pago
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentOptions.map((opt) => {
            const active = formData.paymentMethod === opt.key
            return (
              <button
                type="button"
                key={opt.key}
                onClick={() => selectPayment(opt.key)}
                className={`w-full h-24 rounded-xl border px-4 flex flex-col items-center justify-center text-center transition
                  ${active ? "border-primary-600 bg-primary-50 shadow-sm" : "border-gray-300 hover:bg-gray-50"}`}
              >
                <div className="text-2xl mb-2">{opt.emoji}</div>
                <div className={`font-medium ${active ? "text-primary-700" : "text-gray-700"}`}>{opt.label}</div>
              </button>
            )
          })}
        </div>
        {errors.paymentMethod && (
          <p className="text-sm text-red-600 mt-1">{errors.paymentMethod}</p>
        )}
      </div>
    </div>
  )
}

export default MembershipForm
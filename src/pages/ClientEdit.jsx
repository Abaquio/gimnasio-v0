// src/pages/ClientEdit.jsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Save, X, Check } from "lucide-react"
import FormField from "../components/ui/FormField"

// ---------- Animaciones ----------
const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", staggerChildren: 0.06 },
  },
}
const fadeIn = (d = 0) => ({
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut", delay: d } },
})
const tile = {
  rest: { scale: 1, opacity: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"

// “chips” predefinidos
const QUICK_MONTHS = [1, 3, 12]
const METHODS = [
  { key: "efectivo", label: "Efectivo", emoji: "💵" },
  { key: "transferencia", label: "Transferencia", emoji: "🏦" },
  { key: "debito", label: "Débito", emoji: "💳" },
  { key: "credito", label: "Crédito", emoji: "💎" },
]

export default function ClientEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  // --- Datos básicos del cliente ---
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [renewing, setRenewing] = useState(false)
  const [error, setError] = useState("")
  const [ok, setOk] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  })

  // Información actual de membresía (solo lectura)
  const [membership, setMembership] = useState({
    start_date: null,
    end_date: null,
    estado: "sin_membresia",
  })

  // --- Acciones de membresía ---
  const [months, setMonths] = useState(1)
  const [method, setMethod] = useState("efectivo")
  const [amount, setAmount] = useState("") // CLP opcional (string limpio)

  // Helpers
  const endDatePretty = useMemo(() => {
    try {
      return membership?.end_date ? new Date(membership.end_date).toLocaleDateString("es-CL") : "—"
    } catch {
      return "—"
    }
  }, [membership])

  // Carga inicial
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError("")
        const res = await fetch(`${API_URL}/clients/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return

        setForm({
          nombre: data.nombre ?? "",
          correo: data.correo ?? "",
          telefono: data.telefono ?? "",
        })
        setMembership(data.membership ?? { start_date: null, end_date: null, estado: "sin_membresia" })
      } catch (e) {
        console.error("GET /clients/:id error", e)
        if (!cancelled) setError("No se pudo cargar el cliente")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  // Guardar datos básicos
  const handleSave = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError("")
      setOk("")
      const res = await fetch(`${API_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || `HTTP ${res.status}`)
      }
      setOk("Datos actualizados correctamente.")
    } catch (e) {
      console.error("PUT /clients/:id error", e)
      setError(e.message || "No se pudo actualizar")
    } finally {
      setSaving(false)
    }
  }

  // Renovar / Adelantar
  const handleRenew = async () => {
    try {
      if (!Number(months) || Number(months) <= 0) {
        setError("Indica los meses a renovar (>=1).")
        return
      }
      setRenewing(true)
      setError("")
      setOk("")

      // Limpia CLP a número o null
      const cleanAmount = amount
        ? Number(String(amount).replace(/[^\d]/g, ""))
        : null

      const res = await fetch(`${API_URL}/clients/${id}/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          months: Number(months),
          paymentMethod: method,
          amountClp: cleanAmount, // si va null, el RPC calcula
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)

      // refrescamos estado/fecha final con lo devuelto, si viene
      if (data?.end_date || data?.estado) {
        setMembership((prev) => ({
          ...prev,
          end_date: data.end_date ?? prev.end_date,
          estado: data.estado ?? prev.estado,
        }))
      }

      setOk("Renovación registrada correctamente.")
    } catch (e) {
      console.error("POST /clients/:id/renew error", e)
      setError(e.message || "No se pudo registrar la renovación")
    } finally {
      setRenewing(false)
    }
  }

  // UI helpers
  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.h1 variants={fadeIn(0)} className="text-2xl font-semibold text-gray-900">
        Editar Cliente
      </motion.h1>

      {error && (
        <motion.div
          variants={fadeIn(0.05)}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}
      {ok && (
        <motion.div
          variants={fadeIn(0.05)}
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700"
        >
          {ok}
        </motion.div>
      )}

      {/* Datos Básicos */}
      <motion.form
        onSubmit={handleSave}
        variants={fadeIn(0.08)}
        className="card space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <FormField label="Nombre completo" required>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: Juan Pérez"
            />
          </FormField>

          <FormField label="Correo electrónico" required>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
          </FormField>

          <FormField label="Teléfono" required>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="+56 9 1234 5678"
            />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <X className="h-4 w-4" />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </motion.form>

      {/* Resumen de membresía actual */}
      <motion.div variants={fadeIn(0.12)} className="card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Estado actual</h3>
            <p className="text-sm text-gray-600">
              Vence: <span className="font-medium text-gray-900">{endDatePretty}</span>
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              membership.estado === "vigente"
                ? "bg-green-100 text-green-700"
                : membership.estado === "por_vencer"
                ? "bg-amber-100 text-amber-700"
                : membership.estado === "vencido"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {membership.estado.replace("_", " ")}
          </span>
        </div>
      </motion.div>

      {/* Acciones de Membresía (animada y con “tiles” como en “Nuevo Cliente”) */}
      <motion.div variants={fadeIn(0.16)} className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones de Membresía</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meses */}
          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Meses</p>
            <div className="flex gap-2 mb-3">
              {QUICK_MONTHS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMonths(m)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors border ${
                    Number(months) === m
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {m} {m === 1 ? "mes" : "meses"}
                </button>
              ))}
            </div>

            <FormField label="Personalizado">
              <input
                type="number"
                min={1}
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </FormField>
          </div>

          {/* Método de pago (tiles animados) */}
          <div>
            <p className="text-sm font-medium text-gray-800 mb-2">Método de pago</p>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map((m) => {
                const active = method === m.key
                return (
                  <motion.button
                    key={m.key}
                    type="button"
                    variants={tile}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setMethod(m.key)}
                    className={`relative rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{m.emoji}</span>
                      <div className="font-medium text-gray-900">{m.label}</div>
                    </div>
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white"
                        >
                          <Check className="h-3 w-3" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Monto opcional */}
        <div className="mt-6 max-w-md">
          <FormField label="Monto (CLP) (opcional)">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Si lo dejas vacío, se calcula según el plan/meses"
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Si lo dejas vacío, el sistema calculará automáticamente (precio mensual × meses).
            </p>
          </FormField>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleRenew}
            disabled={renewing}
            className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
          >
            {renewing ? "Procesando..." : "Renovar / Adelantar"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
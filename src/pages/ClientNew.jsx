// src/pages/ClientNew.jsx
"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ClientForm from "../components/clients/ClientForm"
import MembershipForm from "../components/clients/MembershipForm"

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"

export default function ClientNew() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [ok, setOk] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // Cliente
    name: "",
    email: "",
    phone: "",
    // Membresía
    membershipStart: new Date().toISOString().split("T")[0],
    membershipEnd: "",
    planId: null,           // number | null
    monthsOverride: "",     // string vacío para no forzar 0
    priceClp: "",           // texto formateado en UI, se convierte a entero al enviar
    paymentMethod: "",      // 'efectivo'|'transferencia'|'debito'|'credito'
  })

  // --- Cargar planes ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/plans`)
        if (!res.ok) throw new Error("plans fetch failed")
        const data = await res.json()
        setPlans(data?.items ?? [])
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los planes.")
      } finally {
        setLoadingPlans(false)
      }
    })()
  }, [])

  // --- Validación básica ---
  const validate = () => {
    const e = {}
    if (!formData.name?.trim()) e.name = "El nombre es requerido"
    if (!formData.email?.trim()) e.email = "El correo es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Correo inválido"
    if (!formData.phone?.trim()) e.phone = "El teléfono es requerido"

    if (!formData.membershipStart) e.membershipStart = "Fecha de inicio requerida"
    if (!formData.membershipEnd) e.membershipEnd = "Fecha de vencimiento requerida"

    const monthsOk = Number(formData.monthsOverride) > 0
    if (!formData.planId && !monthsOk) {
      e.planId = "Selecciona un plan o indica meses personalizados"
    }

    const price = Number(String(formData.priceClp).replace(/[^\d]/g, ""))
    if (!price || price <= 0) e.priceClp = "Precio inválido"

    if (!formData.paymentMethod) e.paymentMethod = "Selecciona un método de pago"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  // --- Envío ---
  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError("")
    setOk("")
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        membershipStart: formData.membershipStart,
        membershipEnd: formData.membershipEnd,

        planId: formData.planId ? Number(formData.planId) : undefined,
        monthsOverride: formData.monthsOverride
          ? Number(formData.monthsOverride)
          : undefined,

        priceClp: Number(String(formData.priceClp).replace(/[^\d]/g, "")),
        paymentMethod: formData.paymentMethod,
      }

      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "No se pudo crear el cliente")
      }

      setOk("Cliente creado correctamente.")
      setTimeout(() => navigate("/clients"), 1000)
    } catch (err) {
      console.error(err)
      setError(err.message || "Error inesperado al crear el cliente")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={fadeIn(0)} className="text-2xl font-semibold text-gray-900">
        Agregar Cliente
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

      <motion.form
        onSubmit={handleSubmit}
        variants={fadeIn(0.1)}
        className="space-y-6"
      >
        <motion.div variants={fadeIn(0.12)} className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
          <ClientForm formData={formData} onChange={setFormData} errors={errors} />
        </motion.div>

        <motion.div variants={fadeIn(0.14)} className="card">
          {loadingPlans ? (
            <p className="text-sm text-gray-600">Cargando planes…</p>
          ) : (
            <MembershipForm
              plans={plans}
              formData={formData}
              onChange={setFormData}
              errors={errors}
            />
          )}
        </motion.div>

        <motion.div
          variants={fadeIn(0.16)}
          className="flex items-center justify-end gap-4"
        >
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Guardando…" : "Agregar Cliente"}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
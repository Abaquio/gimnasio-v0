// src/pages/Clients.jsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserX, Plus } from "lucide-react"

import { useApp } from "../context/AppContext"
import ClientTable from "../components/clients/ClientTable"
import StatsCard from "../components/clients/StatsCard"

// Animaciones
const container = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
})

// Normaliza status a llaves internas para filtros
function normStatus(status) {
  const s = String(status ?? "").toLowerCase()
  if (s.includes("vencid")) return "expired"
  if (s.includes("vencer") || s.includes("por")) return "warning"
  if (s.includes("vigent") || s.includes("activ")) return "active"
  if (s.includes("sin_membresia")) return "warning"
  return "active"
}

// Mapea item de API al shape de la UI
function mapApiClient(it) {
  return {
    id: it.cliente_id || `api:${(it.correo || "").toLowerCase()}`, // id estable (uuid real si viene)
    name: it.nombre ?? "",
    email: it.correo ?? "",
    phone: it.telefono ?? "",
    status: it.estado ?? "vigente", // vigente | por_vencer | vencido | sin_membresia
    membershipEnd: it.end_date ?? null,
    _source: "api",
  }
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"

export default function Clients() {
  const navigate = useNavigate()
  const { clients: demoClients, deleteClient } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [tab, setTab] = useState("all") // all | active | warning | expired

  const [apiItems, setApiItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Carga segura: si falla la API, seguimos mostrando DEMO
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        setError("")
        const url = `${API_URL}/clients?limit=200&orderBy=nombre&orderDir=asc`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const mapped = (data?.items ?? []).map(mapApiClient)
        if (!cancelled) setApiItems(mapped)
      } catch (e) {
        console.error("GET /clients failed:", e)
        if (!cancelled) {
          setApiItems([]) // sin reales; seguimos con DEMO
          setError("No se pudieron cargar los clientes desde el servidor. Mostrando datos de demo.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Fusión estable: **PRIORIDAD DEMO**; reales solo si ese email no existe en DEMO
  const merged = useMemo(() => {
    const byEmail = new Map()

    // DEMO primero (prioridad)
    for (const demo of demoClients) {
      const emailKey = (demo.email || "").toLowerCase()
      const key = emailKey || `demo:${demo.id}` // determinístico
      byEmail.set(key, {
        id: demo.id ?? key,
        name: demo.name ?? "",
        email: demo.email ?? "",
        phone: demo.phone ?? "",
        status: demo.status ?? "vigente",
        membershipEnd: demo.membershipEnd ?? null,
        _source: "demo",
      })
    }

    // API después (solo si no existe ese email)
    for (const real of apiItems) {
      const emailKey = (real.email || "").toLowerCase()
      const key = emailKey || `api:${real.id}`
      if (!byEmail.has(key)) {
        byEmail.set(key, real)
      }
    }

    return Array.from(byEmail.values())
  }, [apiItems, demoClients])

  // Métricas
  const stats = useMemo(() => {
    const total = merged.length
    let active = 0,
      warning = 0,
      expired = 0
    for (const c of merged) {
      const k = normStatus(c.status)
      if (k === "active") active++
      else if (k === "warning") warning++
      else if (k === "expired") expired++
    }
    return { total, active, warning, expired }
  }, [merged])

  // Filtro por pestaña
  const byTab = useMemo(() => {
    if (tab === "all") return merged
    return merged.filter((c) => normStatus(c.status) === tab)
  }, [merged, tab])

  // Búsqueda
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return byTab
    return byTab.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(c.phone).includes(q),
    )
  }, [byTab, searchTerm])

  // Acciones
  const handleEdit = (client) => {
    // Usamos id real si existe; evitamos ids sintéticos de demo/api:
    const id = client?.id
    const idStr = String(id ?? "")
    const isSynthetic = idStr.startsWith("demo:") || idStr.startsWith("api:")
    if (!id || isSynthetic) {
      alert("Este registro de demostración no tiene un ID real para editar.")
      return
    }
    navigate(`/clients/${id}/edit`)
  }

  const handleDelete = (client) => {
    if (client._source === "api") {
      alert("Este cliente proviene de la BD y aún no implementamos el borrado real.")
      return
    }
    if (window.confirm(`¿Estás seguro de eliminar a ${client.name}?`)) {
      deleteClient(client.id)
    }
  }

  // Estilos de pestañas
  const tabBtnBase =
    "px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2"
  const tabStyles = (key) => {
    switch (key) {
      case "all":
        return key === tab
          ? "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 focus:ring-primary-500"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 focus:ring-primary-300"
      case "active":
        return key === tab
          ? "bg-green-600 text-white border-green-600 hover:bg-green-700 focus:ring-green-500"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 focus:ring-green-300"
      case "warning":
        return key === tab
          ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 focus:ring-amber-400"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 focus:ring-amber-300"
      case "expired":
        return key === tab
          ? "bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 focus:ring-red-300"
      default:
        return "bg-white text-gray-700 border-gray-200"
    }
  }

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      {/* Métricas */}
      <motion.div variants={fadeIn(0.03)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard title="Total Clientes" value={stats.total} type="total" />
        <StatsCard title="Vigentes" value={stats.active} type="active" />
        <StatsCard title="Por Vencer" value={stats.warning} type="warning" />
        <StatsCard title="Vencidos" value={stats.expired} type="expired" />
      </motion.div>

      {/* Buscador + Filtros + CTA */}
      <motion.div
        variants={fadeIn(0.06)}
        className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
      >
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-shadow shadow-sm hover:shadow"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setTab("all")} className={`${tabBtnBase} ${tabStyles("all")}`}>
            Todos
          </button>
          <button onClick={() => setTab("active")} className={`${tabBtnBase} ${tabStyles("active")}`}>
            Vigentes
          </button>
          <button onClick={() => setTab("warning")} className={`${tabBtnBase} ${tabStyles("warning")}`}>
            Por Vencer
          </button>
          <button onClick={() => setTab("expired")} className={`${tabBtnBase} ${tabStyles("expired")}`}>
            Vencidos
          </button>

          <Link
            to="/clients/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm 
                       transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4" />
            + Nuevo Cliente
          </Link>
        </div>
      </motion.div>

      {/* Aviso suave si falló la API, pero no bloquea DEMO */}
      {error && (
        <motion.div
          variants={fadeIn(0.08)}
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800"
        >
          {error}
        </motion.div>
      )}

      {/* Card + Tabla */}
      <motion.div variants={fadeIn(0.1)} className="card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Cargando clientes…</div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={`table-${tab}-${searchTerm}-${filtered.length}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <ClientTable
                  clients={filtered}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`empty-${tab}-${searchTerm}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <UserX className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sin resultados</h3>
                <p className="mt-1 text-sm text-gray-600">
                  No encontramos clientes que coincidan con “{searchTerm}”.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  )
}
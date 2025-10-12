"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, UserX, Plus } from "lucide-react"

import { useApp } from "../context/AppContext"
import { membershipsService } from "../services/membershipsService"

import StatsCard from "../components/clients/StatsCard"
import ClientTable from "../components/clients/ClientTable"

// Animaciones
const container = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}
const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
})

// Normalizador robusto con fallback por fecha
function normalizeStatus(rawStatus, membershipEnd) {
  const s = String(rawStatus ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase()
  if (s.includes("vencid")) return "expired"
  if (s.includes("vencer") || s.includes("por")) return "warning"
  if (s.includes("vigent") || s.includes("activ")) return "active"

  // Fallback por fecha (por si el servicio devuelve algo inesperado)
  if (membershipEnd) {
    const end = new Date(membershipEnd)
    const today = new Date()
    const ms = end - today
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    if (days < 0) return "expired"
    if (days <= 7) return "warning"
    return "active"
  }
  return "active"
}

export default function Clients() {
  const { clients, deleteClient } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [tab, setTab] = useState("all") // all | active | warning | expired

  // 1) Enriquecer clientes con status del servicio + uiStatus normalizado
  const enriched = useMemo(() => {
    return clients.map((c) => {
      const raw = membershipsService.calculateStatus(c.membershipEnd)
      const uiStatus = normalizeStatus(raw, c.membershipEnd)
      return { ...c, status: raw, uiStatus }
    })
  }, [clients])

  // 2) Stats
  const stats = useMemo(() => {
    let active = 0, warning = 0, expired = 0
    for (const c of enriched) {
      if (c.uiStatus === "active") active++
      else if (c.uiStatus === "warning") warning++
      else if (c.uiStatus === "expired") expired++
    }
    return { total: enriched.length, active, warning, expired }
  }, [enriched])

  // 3) Filtro por pestaña (usa uiStatus)
  const byTab = useMemo(() => {
    if (tab === "all") return enriched
    return enriched.filter((c) => c.uiStatus === tab)
  }, [enriched, tab])

  // 4) Filtro por búsqueda
  const filteredClients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return byTab
    return byTab.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        String(c.phone).includes(q)
    )
  }, [byTab, searchTerm])

  // Acciones
  const handleEdit = (client) => {
    alert(`Editar cliente: ${client.name}\n(Funcionalidad pendiente)`)
  }
  const handleDelete = (client) => {
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
      {/* Tarjetas */}
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
          <button onClick={() => setTab("all")} className={`${tabBtnBase} ${tabStyles("all")}`}>Todos</button>
          <button onClick={() => setTab("active")} className={`${tabBtnBase} ${tabStyles("active")}`}>Vigentes</button>
          <button onClick={() => setTab("warning")} className={`${tabBtnBase} ${tabStyles("warning")}`}>Por Vencer</button>
          <button onClick={() => setTab("expired")} className={`${tabBtnBase} ${tabStyles("expired")}`}>Vencidos</button>

          <Link
            to="/clients/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm 
                       transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Link>
        </div>
      </motion.div>

      {/* Card + Tabla */}
      <motion.div variants={fadeIn(0.1)} className="card overflow-hidden">
        <AnimatePresence mode="wait">
          {filteredClients.length > 0 ? (
            <motion.div
              key={`table-${tab}-${searchTerm}-${filteredClients.length}`} // <-- fuerza re-monte para animar y refrescar
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <ClientTable
                clients={filteredClients}
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
      </motion.div>
    </motion.div>
  )
}
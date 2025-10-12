// Servicio para gestión de mensualidades
export const membershipsService = {
  // Calcula el estado de la membresía según fecha de vencimiento
  calculateStatus: (endDate) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "vencido"
    if (diffDays <= 7) return "por_vencer"
    return "vigente"
  },

  // Calcula fecha de vencimiento (30 días desde inicio)
  calculateEndDate: (startDate) => {
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + 30)
    return end.toISOString().split("T")[0]
  },

  // GET /api/memberships/expiring
  getExpiring: async () => {
    // return await fetch('/api/memberships/expiring').then(res => res.json())
    return []
  },

  // POST /api/memberships
  create: async (membershipData) => {
    // return await fetch('/api/memberships', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(membershipData)
    // }).then(res => res.json())
    return membershipData
  },
}

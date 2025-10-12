// Servicio preparado para conectar con API REST
export const staffService = {
  // GET /api/staff
  getAll: async () => {
    // return await fetch('/api/staff').then(res => res.json())
    // Por ahora retorna mock desde contexto
    return []
  },

  // GET /api/staff/:id
  getById: async (id) => {
    // return await fetch(`/api/staff/${id}`).then(res => res.json())
    return null
  },

  // POST /api/staff
  create: async (staffData) => {
    // return await fetch('/api/staff', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(staffData)
    // }).then(res => res.json())
    return staffData
  },

  // PUT /api/staff/:id
  update: async (id, staffData) => {
    // return await fetch(`/api/staff/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(staffData)
    // }).then(res => res.json())
    return staffData
  },

  // DELETE /api/staff/:id
  delete: async (id) => {
    // return await fetch(`/api/staff/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json())
    return { success: true }
  },
}

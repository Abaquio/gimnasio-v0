// Servicio preparado para conectar con API REST
export const clientsService = {
  // GET /api/clients
  getAll: async () => {
    // return await fetch('/api/clients').then(res => res.json())
    // Por ahora retorna mock desde contexto
    return []
  },

  // GET /api/clients/:id
  getById: async (id) => {
    // return await fetch(`/api/clients/${id}`).then(res => res.json())
    return null
  },

  // POST /api/clients
  create: async (clientData) => {
    // return await fetch('/api/clients', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(clientData)
    // }).then(res => res.json())
    return clientData
  },

  // PUT /api/clients/:id
  update: async (id, clientData) => {
    // return await fetch(`/api/clients/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(clientData)
    // }).then(res => res.json())
    return clientData
  },

  // DELETE /api/clients/:id
  delete: async (id) => {
    // return await fetch(`/api/clients/${id}`, {
    //   method: 'DELETE'
    // }).then(res => res.json())
    return { success: true }
  },
}

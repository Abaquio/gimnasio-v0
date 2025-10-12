"use client"

import { createContext, useContext, useState } from "react"
import { mockUser } from "../data/mockUser"
import { mockClients } from "../data/mockClients"

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp debe usarse dentro de AppProvider")
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(mockUser)
  const [clients, setClients] = useState(mockClients)

  const addClient = (client) => {
    const newClient = {
      ...client,
      id: clients.length + 1,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setClients([...clients, newClient])
    return newClient
  }

  const updateClient = (id, updatedData) => {
    setClients(clients.map((client) => (client.id === id ? { ...client, ...updatedData } : client)))
  }

  const deleteClient = (id) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const updateUser = (updatedData) => {
    setUser({ ...user, ...updatedData })
  }

  const value = {
    user,
    updateUser,
    clients,
    addClient,
    updateClient,
    deleteClient,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

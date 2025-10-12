"use client"

import { Link, useLocation } from "react-router-dom"
import { useApp } from "../../context/AppContext"

const Topbar = () => {
  const { user, toggleSidebar } = useApp()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard"
      case "/clients":
        return "Clientes"
      case "/clients/new":
        return "Agregar Cliente"
      case "/staff":
        return "Staff"
      case "/staff/new":
        return "Agregar Staff"
      case "/profile":
        return "Mi Perfil"
      default:
        return "GymAdmin"
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>

          <Link
            to="/profile"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
            title="Ver perfil"
          >
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Topbar

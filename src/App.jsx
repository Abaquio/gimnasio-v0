import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppProvider } from "./context/AppContext"
import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import Home from "./pages/Home"
import Clients from "./pages/Clients"
import ClientNew from "./pages/ClientNew"
import Profile from "./pages/Profile"
import Staff from "./pages/Staff"
import StaffNew from "./pages/StaffNew"
import ClientEdit from "./pages/ClientEdit"

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/new" element={<ClientNew />} />
                <Route path="/clients/:id/edit" element={<ClientEdit />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/staff/new" element={<StaffNew />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

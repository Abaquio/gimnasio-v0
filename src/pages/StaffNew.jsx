import StaffForm from "../components/staff/StaffForm"

const StaffNew = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Agregar Staff</h1>
        <p className="text-gray-600 mt-1">Crea una nueva cuenta de acceso al sistema</p>
      </div>

      <StaffForm />
    </div>
  )
}

export default StaffNew

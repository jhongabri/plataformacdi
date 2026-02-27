import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children, title, onDashboardClick, onGestionClick, onReportesClick }) {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">

        <div className="p-6 text-center border-b border-blue-800">
          <h1 className="text-xl font-bold">Plataforma CDI</h1>
          <p className="text-xs text-blue-200 mt-1">
            Sistema Académico
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <button onClick={onDashboardClick} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800 transition">
            Dashboard
          </button>

          <button onClick={onGestionClick} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800 transition">
            Gestión
          </button>

          <button onClick={onReportesClick} className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-800 transition">
            Reportes
          </button>

        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-sm transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">
            {title}
          </h2>

          <div className="text-sm text-gray-600">
            Bienvenido, <span className="font-semibold">{usuario?.nombre}</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}
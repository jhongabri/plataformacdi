import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNinos: 0,
    totalDocentes: 0,
    totalUsuarios: 0,
  });

  const [loading, setLoading] = useState(true);

  // Estado para la vista activa
  const [activeView, setActiveView] = useState("dashboard");

  // Handlers para los botones del sidebar
  const handleDashboardClick = () => setActiveView("dashboard");
  const handleGestionClick = () => setActiveView("gestion");
  const handleReportesClick = () => setActiveView("reportes");

  // Estados para el formulario de crear docente
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error obteniendo estadísticas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCreateDocente = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/admin/docentes", {
        nombre,
        correo,
        password,
      });

      setSuccess("Docente creado correctamente");
      setNombre("");
      setCorreo("");
      setPassword("");

      // Refresh stats
      const statsRes = await API.get("/admin/stats");
      setStats(statsRes.data);

    } catch (error) {
      setError(error.response?.data?.message || "Error creando docente");
    }
  };

  // Datos para el gráfico
  const chartData = [
    { name: "Niños", cantidad: stats.totalNinos },
    { name: "Docentes", cantidad: stats.totalDocentes },
    { name: "Usuarios", cantidad: stats.totalUsuarios },
  ];

  return (
    <DashboardLayout title="Dashboard Administrador">
      {loading ? (
        <p className="text-gray-500">Cargando estadísticas...</p>
      ) : (
        <>
          {/* Tarjetas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <StatCard
              title="Niños Activos"
              value={stats.totalNinos}
              Icon={AcademicCapIcon}
              color="text-blue-900"
              iconColor="text-blue-200"
            />

            <StatCard
              title="Docentes"
              value={stats.totalDocentes}
              Icon={UserGroupIcon}
              color="text-indigo-900"
              iconColor="text-indigo-200"
            />

            <StatCard
              title="Usuarios Totales"
              value={stats.totalUsuarios}
              Icon={UsersIcon}
              color="text-slate-900"
              iconColor="text-slate-300"
            />

          </div>

          {/* Gráfico */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Resumen General
            </h3>

            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#1e3a8a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gestión de Docentes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center">
              <PlusIcon className="w-6 h-6 mr-2 text-blue-600" />
              Crear Nuevo Docente
            </h3>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleCreateDocente} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Ingresa el nombre del docente"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  placeholder="Ingresa una contraseña segura"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md flex items-center justify-center"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Crear Docente
              </button>
            </form>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function StatCard({ title, value, Icon, color, iconColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className={`text-3xl font-bold mt-2 ${color}`}>
            {value}
          </p>
        </div>
        <Icon className={`w-12 h-12 ${iconColor}`} />
      </div>
    </div>
  );
}
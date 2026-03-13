import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/axios";

import {
  AcademicCapIcon,
  UserGroupIcon,
  UsersIcon,
  DocumentTextIcon,
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

import GestionCards from "../components/admin/GestionCards";
import CreateDocenteForm from "../components/admin/CreateDocenteForm";
import CreateGrupoForm from "../components/admin/CreateGrupoForm";
import DocentesList from "../components/admin/DocentesList";
import GruposList from "../components/admin/GruposList";
import ExcelImportModal from "../components/admin/ExcelImportModal";
import AsignarGrupoModal from "../components/admin/AsignarGrupoModal";

// StatCard Component
const StatCard = ({ title, value, Icon, color, iconColor }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-default">
    <div className="flex items-center justify-between">
      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl group-hover:scale-105 transition-transform">
        <Icon className={`w-10 h-10 ${iconColor}`} />
      </div>
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    </div>
    <div className="mt-6">
      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
      <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalNinos: 0,
    totalDocentes: 0,
    totalUsuarios: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");
  const [gestionSubView, setGestionSubView] = useState("cards");

  const handleDashboardClick = () => setActiveView("dashboard");
  const handleGestionClick = () => {
    setActiveView("gestion");
    setGestionSubView("cards");
  };
  const handleReportesClick = () => setActiveView("reportes");

  const [reportes, setReportes] = useState([]);
  const [reportesLoading, setReportesLoading] = useState(false);
  const [docentes, setDocentes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [gruposLoading, setGruposLoading] = useState(false);
  const [docentesLoading, setDocentesLoading] = useState(false);
  const [gestionLoading, setGestionLoading] = useState(false);
  const [gestionError, setGestionError] = useState("");
  const [error, setError] = useState("");
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [selectedGrupoExcel, setSelectedGrupoExcel] = useState(null);

  // Modal Asignar Grupo states
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [selectedGrupoId, setSelectedGrupoId] = useState("");
  const [asignandoGrupo, setAsignandoGrupo] = useState(false);
  const [grupoError, setGrupoError] = useState("");

  // ✅ FIX: Un único handler que siempre limpia el estado antes de abrir el modal
  const handleOpenAsignarModal = (docente) => {
    setSelectedDocente(docente);
    setSelectedGrupoId("");   // limpiar selección previa
    setGrupoError("");        // limpiar error previo
    setShowAsignarModal(true);
  };

  const handleCloseAsignarModal = () => {
    setShowAsignarModal(false);
    setSelectedDocente(null);
    setSelectedGrupoId("");
    setGrupoError("");
  };

  const handleGrupoChange = (grupoId) => {
    setSelectedGrupoId(grupoId);
    setGrupoError("");
  };

  const handleAsignarGrupoSubmit = async () => {
    if (!selectedGrupoId) {
      setGrupoError("Selecciona un grupo");
      return;
    }
    setAsignandoGrupo(true);
    setGrupoError("");
    try {
      await API.put("/admin/docentes/asignar-grupo", {
        id_docente: selectedDocente.id_usuario,
        id_grupo: selectedGrupoId,
      });
      handleCloseAsignarModal();
      refreshDocentes();
      refreshGrupos();
    } catch (err) {
      setGrupoError(err.response?.data?.message || "Error asignando grupo");
    } finally {
      setAsignandoGrupo(false);
    }
  };

  const refreshStats = useCallback(async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
      setError("");
    } catch (err) {
      setError("Error cargando estadísticas");
    }
  }, []);

  const refreshDocentes = useCallback(async () => {
    try {
      const res = await API.get("/admin/docentes");
      setDocentes(res.data);
      setError("");
    } catch (err) {
      setError("Error cargando docentes");
    }
  }, []);

  const refreshGrupos = useCallback(async () => {
    try {
      const res = await API.get("/grupos");
      setGrupos(res.data);
      setError("");
    } catch (err) {
      setError("Error cargando grupos");
    }
  }, []);

  useEffect(() => {
    if (activeView === "reportes") {
      const fetchReportes = async () => {
        setReportesLoading(true);
        try {
          const res = await API.get("/docente/reportes/admin");
          setReportes(res.data);
        } catch (error) {
          // Silent fail
        } finally {
          setReportesLoading(false);
        }
      };
      fetchReportes();
    }
  }, [activeView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeView === "gestion") {
      const fetchGestionData = async () => {
        setGestionLoading(true);
        setGestionError("");
        try {
          const [docentesRes, gruposRes] = await Promise.all([
            API.get("/admin/docentes"),
            API.get("/grupos"),
          ]);
          setDocentes(docentesRes.data || []);
          setGrupos(gruposRes.data || []);
        } catch (error) {
          console.error("Gestion data fetch error:", error);
          setGestionError("Error cargando datos de gestión. Verifica que el backend esté corriendo.");
          setDocentes([]);
          setGrupos([]);
        } finally {
          setGestionLoading(false);
          setDocentesLoading(false);
          setGruposLoading(false);
        }
      };
      fetchGestionData();
    }
  }, [activeView]);

  const chartData = [
    { name: "Niños", cantidad: stats.totalNinos },
    { name: "Docentes", cantidad: stats.totalDocentes },
    { name: "Usuarios", cantidad: stats.totalUsuarios },
  ];

  const ReportesPanel = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center mb-8">
          <svg className="w-10 h-10 text-orange-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reportes del Sistema</h2>
            <p className="text-gray-500">Reportes generados por los docentes</p>
          </div>
        </div>

        {reportesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-lg text-gray-500">Cargando reportes...</span>
          </div>
        ) : reportes.length === 0 ? (
          <div className="text-center py-20">
            <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400 mb-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes</h3>
            <p className="text-gray-500">Los reportes aparecerán aquí cuando los docentes los generen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportes.map((reporte) => (
              <div key={reporte.id_reporte} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                <h4 className="font-semibold text-gray-900 mb-2">{reporte.titulo || "Reporte"}</h4>
                <p className="text-sm text-gray-600 mb-3">{reporte.descripcion}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(reporte.fecha).toLocaleDateString()}</span>
                  <span>Docente: {reporte.nombre_docente}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title={
        activeView === "gestion"
          ? "Gestión de Docentes"
          : activeView === "reportes"
          ? "Reportes"
          : "Dashboard Administrador"
      }
      onDashboardClick={handleDashboardClick}
      onGestionClick={handleGestionClick}
      onReportesClick={handleReportesClick}
    >
      {loading ? (
        <p className="text-gray-500 text-center py-12">Cargando estadísticas...</p>
      ) : (
        <>
          {/* Vista Principal: Dashboard */}
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-6">
                <StatCard title="Niños Activos" value={stats.totalNinos} Icon={AcademicCapIcon} color="text-blue-900" iconColor="text-blue-200" />
                <StatCard title="Docentes" value={stats.totalDocentes} Icon={UserGroupIcon} color="text-indigo-900" iconColor="text-indigo-200" />
                <StatCard title="Usuarios Totales" value={stats.totalUsuarios} Icon={UsersIcon} color="text-slate-900" iconColor="text-slate-300" />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mx-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-6">Resumen General</h3>
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
            </>
          )}

          {/* Vista Principal: Reportes */}
          {activeView === "reportes" && <ReportesPanel />}

          {/* Vista de Gestión */}
          {activeView === "gestion" && (
            <>
              {gestionLoading ? (
                <div className="max-w-7xl mx-auto py-12 px-6 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Cargando Gestión...</h3>
                    <p className="text-gray-500">Obteniendo docentes y grupos</p>
                  </div>
                </div>
              ) : gestionError ? (
                <div className="max-w-7xl mx-auto py-12 px-6">
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                    <svg className="mx-auto h-16 w-16 text-red-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-red-900 mb-2">{gestionError}</h3>
                    <p className="text-red-700 mb-6">Intenta recargando la página o verifica el servidor backend.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-xl transition"
                    >
                      Recargar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto py-12 px-6">
                  {gestionSubView === "cards" && (
                    <GestionCards
                      onCreateDocente={() => setGestionSubView("createDocente")}
                      onCreateGrupo={() => setGestionSubView("createGrupo")}
                      onViewDocentes={() => setGestionSubView("docentes")}
                      onViewGrupos={() => setGestionSubView("grupos")}
                      onReportes={() => setGestionSubView("reportes")}
                      docentesCount={docentes.length}
                      gruposCount={grupos.length}
                    />
                  )}

                  {gestionSubView === "reportes" && <ReportesPanel />}

                  {gestionSubView === "createDocente" && (
                    <CreateDocenteForm
                      onBack={() => setGestionSubView("cards")}
                      onRefreshStats={refreshStats}
                      onSuccess={refreshDocentes}
                    />
                  )}

                  {gestionSubView === "createGrupo" && (
                    <CreateGrupoForm
                      onBack={() => setGestionSubView("cards")}
                      onSuccess={refreshGrupos}
                    />
                  )}

                  {/* ✅ FIX: usa handleOpenAsignarModal que limpia estado antes de abrir */}
                  {gestionSubView === "docentes" && (
                    <DocentesList
                      docentes={docentes}
                      grupos={grupos}
                      loading={docentesLoading || gruposLoading}
                      onAsignarGrupo={handleOpenAsignarModal}
                      onBack={() => setGestionSubView("cards")}
                    />
                  )}

                  {gestionSubView === "grupos" && (
                    <GruposList
                      grupos={grupos}
                      loading={gruposLoading}
                      onImportExcel={(grupo) => {
                        setSelectedGrupoExcel(grupo);
                        setShowExcelModal(true);
                      }}
                      onBack={() => setGestionSubView("cards")}
                    />
                  )}
                </div>
              )}

              {/* Modales fuera del ternario pero dentro del Fragment */}
              {showExcelModal && selectedGrupoExcel && (
                <ExcelImportModal
                  isOpen={showExcelModal}
                  grupo={selectedGrupoExcel}
                  onClose={() => {
                    setShowExcelModal(false);
                    setSelectedGrupoExcel(null);
                  }}
                  onSuccess={refreshGrupos}
                />
              )}

              <AsignarGrupoModal
                isOpen={showAsignarModal}
                docente={selectedDocente}
                grupos={grupos}
                grupoSeleccionado={selectedGrupoId}
                onGrupoChange={handleGrupoChange}
                onSubmit={handleAsignarGrupoSubmit}
                onClose={handleCloseAsignarModal}
                asignando={asignandoGrupo}
                error={grupoError}
              />
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
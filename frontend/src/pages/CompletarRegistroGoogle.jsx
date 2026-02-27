import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios";

export default function CompletarRegistroGoogle() {
  const location = useLocation();
  const navigate = useNavigate();

  const correoInicial = location.state?.correo || "";
  const nombreInicial = location.state?.nombre || "";

  const [nombre, setNombre] = useState(nombreInicial);
  const [correo] = useState(correoInicial);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComplete = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/google/complete", {
        nombre,
        correo,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));

      // Redirección por rol
      if (res.data.user.id_rol === 1) {
        navigate("/admin");
      } else if (res.data.user.id_rol === 2) {
        navigate("/docente");
      } else {
        navigate("/acudiente");
      }

    } catch (err) {
      setError("Error al completar registro");
    } finally {
      setLoading(false);
    }
  };

  // Si alguien entra manualmente sin Google
  if (!correoInicial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Acceso no autorizado
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600 px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl">

        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Completar Registro
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleComplete} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition duration-300 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Finalizar Registro"}
          </button>
        </form>

      </div>
    </div>
  );
}
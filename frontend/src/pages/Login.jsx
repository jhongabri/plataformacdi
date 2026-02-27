import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api/axios";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectByRole = (user) => {
    if (user.id_rol === 1) {
      navigate("/admin");
    } else if (user.id_rol === 2) {
      navigate("/docente");
    } else {
      navigate("/acudiente");
    }
  };

  // LOGIN NORMAL
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", {
        correo,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));

      redirectByRole(res.data.user);

    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  // LOGIN GOOGLE
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      // Usuario nuevo → completar registro
      if (res.data.nuevo) {
        navigate("/completar-registro", {
          state: {
            correo: res.data.correo,
            nombre: res.data.nombre,
          },
        });
        return;
      }

      // Usuario existente
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));

      redirectByRole(res.data.user);

    } catch (error) {
      setError("Error con autenticación Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-600 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">
            Plataforma CDI
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sistema Académico Integral
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* LOGIN NORMAL */}
        <form onSubmit={handleLogin} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
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
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
          >
            Ingresar al sistema
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400 text-sm">
          — o —
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Error con Google")}
          />
        </div>

        {/* REGISTRO */}
        <p className="text-center text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Regístrate aquí
          </span>
        </p>

        <p className="text-center text-xs text-gray-400 mt-8">
          © {new Date().getFullYear()} CDI - Centro de Desarrollo Infantil
        </p>

      </div>
    </div>
  );
}
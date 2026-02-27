import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DocenteDashboard from "./pages/DocenteDashboard";
import AcudienteDashboard from "./pages/AcudienteDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import CompletarRegistroGoogle from "./pages/CompletarRegistroGoogle";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Admin protegido */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Docente protegido */}
        <Route
          path="/docente"
          element={
            <ProtectedRoute>
              <DocenteDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Acudiente protegido */}
        <Route
          path="/acudiente"
          element={
            <ProtectedRoute>
              <AcudienteDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route path="/completar-registro" element={<CompletarRegistroGoogle />} />

        {/* Redirección si la ruta no existe */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
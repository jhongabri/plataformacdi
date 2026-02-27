import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import { useNavigate } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();

  const menuByRole = {
    1: [
      { name: "Dashboard", icon: HomeIcon, path: "/admin" },
      { name: "Usuarios", icon: UsersIcon, path: "/usuarios" },
      { name: "Niños", icon: AcademicCapIcon, path: "/ninos" },
      { name: "Reportes", icon: ChartBarIcon, path: "/reportes" },
    ],
    2: [
      { name: "Dashboard", icon: HomeIcon, path: "/docente" },
      { name: "Mis Niños", icon: AcademicCapIcon, path: "/mis-ninos" },
      { name: "Actividades", icon: ClipboardDocumentListIcon, path: "/actividades" },
    ],
    3: [
      { name: "Dashboard", icon: HomeIcon, path: "/acudiente" },
      { name: "Seguimiento", icon: ClipboardDocumentListIcon, path: "/seguimiento" },
      { name: "Reportes", icon: ChartBarIcon, path: "/reportes" },
    ],
  };

  const menu = menuByRole[user?.id_rol] || [];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-8 text-center">
        Plataforma CDI
      </h2>

      <nav className="space-y-4">
        {menu.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700 transition"
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
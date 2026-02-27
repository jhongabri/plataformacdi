export default function Navbar({ user }) {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-slate-700">
        Bienvenido, {user?.nombre}
      </h1>

      <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm font-medium">
        Rol: {user?.id_rol === 1
          ? "Administrador"
          : user?.id_rol === 2
          ? "Docente"
          : "Acudiente"}
      </div>
    </header>
  );
}
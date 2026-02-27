import DashboardLayout from "../layouts/DashboardLayout";

export default function DocenteDashboard() {
  return (
    <DashboardLayout title="Panel Docente">

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700">
          Bienvenido al módulo docente
        </h3>
        <p className="text-gray-500 mt-2">
          Aquí podrás gestionar actividades y seguimiento académico.
        </p>
      </div>

    </DashboardLayout>
  );
}
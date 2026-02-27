import DashboardLayout from "../layouts/DashboardLayout";

export default function AcudienteDashboard() {
  return (
    <DashboardLayout title="Panel del Acudiente">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Hijo(a) registrado</h3>
          <p className="text-xl font-semibold text-blue-800 mt-2">
            Juan Pérez
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Estado Académico</h3>
          <p className="text-xl font-semibold text-green-600 mt-2">
            Excelente progreso
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Último Reporte</h3>
          <p className="text-gray-600 mt-2">
            Desarrollo socioemocional adecuado.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Próxima reunión</h3>
          <p className="text-gray-600 mt-2">
            15 de Marzo - 8:00 AM
          </p>
        </div>

      </div>

    </DashboardLayout>
  );
}
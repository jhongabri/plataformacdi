import React, { useState } from 'react';
import API from '../../api/axios';
import { PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

const CreateGrupoForm = ({ onSuccess, onCancel, onRefreshGrupos }) => {
  const [nombre, setNombre] = useState("");
  const [edadMin, setEdadMin] = useState("");
  const [edadMax, setEdadMax] = useState("");
  const [horario, setHorario] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (parseInt(edadMin) >= parseInt(edadMax)) {
      setError("Edad mínima debe ser menor que edad máxima");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/grupos", {
        nombre,
        edad_minima: parseInt(edadMin),
        edad_maxima: parseInt(edadMax),
        horario: horario || null
      });

      setSuccess("Grupo creado correctamente");
      setNombre("");
      setEdadMin("");
      setEdadMax("");
      setHorario("");

      if (onSuccess) onSuccess();
      if (onRefreshGrupos) onRefreshGrupos();

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Error creando grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Grupo</h2>
        <p className="text-gray-500">Define el grupo de estudiantes</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl mb-6 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Grupo *
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            placeholder="Ej: Maternal A"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Edad Mínima *
          </label>
          <input
            type="number"
            min="0"
            max="99"
            value={edadMin}
            onChange={(e) => setEdadMin(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            placeholder="2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Edad Máxima *
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={edadMax}
            onChange={(e) => setEdadMax(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            placeholder="4"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Horario (opcional)
          </label>
          <input
            type="text"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            placeholder="Ej: 8:00am - 12:00pm"
          />
        </div>

        <div className="md:col-span-2 flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5 mr-2" />
                Crear Grupo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGrupoForm;


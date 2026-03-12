import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const AsignarGrupoModal = ({ 
  isOpen, 
  docente, 
  grupos, 
  grupoSeleccionado, 
  onGrupoChange, 
  onSubmit, 
  onClose, 
  asignando, 
  error 
}) => {
  if (!isOpen || !docente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckIcon className="w-8 h-8 text-green-600 mr-3" />
            Asignar Grupo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-bold hover:scale-110 transition"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-1">{docente.nombre}</h4>
          <p className="text-sm text-gray-600">{docente.correo}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Seleccionar Grupo
            </label>
            <select
              value={grupoSeleccionado}
              onChange={onGrupoChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            >
              <option value="">— Sin grupo asignado —</option>
              {grupos.map((grupo) => (
                <option key={grupo.id_grupo} value={grupo.id_grupo}>
                  {grupo.nombre} ({grupo.edad_minima}-{grupo.edad_maxima} años)
                  {grupo.horario && ` | ${grupo.horario}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={asignando}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-xl transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={asignando}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition shadow-lg disabled:opacity-50 flex items-center justify-center"
            >
              {asignando ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Asignando...
                </>
              ) : (
                'Asignar Grupo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarGrupoModal;


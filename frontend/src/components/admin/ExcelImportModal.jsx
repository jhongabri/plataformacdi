import React, { useState, useCallback } from 'react';
import API from '../../api/axios';
import { CloudArrowUpIcon, XMarkIcon, UsersIcon } from '@heroicons/react/24/outline';

const ExcelImportModal = ({ 
  isOpen, 
  grupo, 
  onClose, 
  onSuccess,
  estudiantes = []
}) => {
  const [file, setFile] = useState(null);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [estudiantesLoading, setEstudiantesLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setImportError("");
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile);
      setImportError("");
    } else {
      setImportError("Solo archivos Excel (.xlsx, .xls) son permitidos");
    }
  }, []);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setImportError("Selecciona un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);
    formData.append("id_grupo", grupo.id_grupo);

    setUploading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const res = await API.post("/admin/grupos/importar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setImportSuccess(`✅ Importación completada: ${res.data.resultados.creados} creados, ${res.data.resultados.existentes} existentes`);
      
      if (onSuccess) onSuccess();
      
      setTimeout(() => setImportSuccess(""), 5000);
    } catch (error) {
      setImportError(error.response?.data?.message || "Error en la importación");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen || !grupo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <CloudArrowUpIcon className="w-12 h-12 text-emerald-600 mr-4" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Importar Estudiantes</h2>
              <p className="text-lg text-gray-600">{grupo.nombre}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-2xl text-gray-500 hover:text-gray-900 transition"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Mensajes */}
        {importError && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 p-6 rounded-2xl mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-lg mb-1">Error en importación</h4>
                <p>{importError}</p>
              </div>
            </div>
          </div>
        )}
        {importSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 p-6 rounded-2xl mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-lg mb-1">¡Importación exitosa!</h4>
                <p>{importSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <form onSubmit={handleImport} className="mb-12">
          <div 
            className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 hover:border-emerald-400 ${
              file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              required
            />
            <label htmlFor="excel-file" className="cursor-pointer block">
              <CloudArrowUpIcon className={`w-20 h-20 mx-auto mb-6 ${file ? 'text-emerald-600' : 'text-gray-400'}`} />
              
              {file ? (
                <div>
                  <p className="text-2xl font-bold text-emerald-600 mb-2">{file.name}</p>
                  <p className="text-lg text-gray-600 mb-6">Archivo listo para importar</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Arrastra tu archivo Excel</p>
                  <p className="text-xl text-gray-500 mb-4">o</p>
                  <p className="text-lg text-gray-600 mb-6">Columnas: nombre, apellido, codigo, edad</p>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || uploading || estudiantesLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-4 px-8 rounded-2xl transition shadow-xl text-lg flex items-center justify-center mx-auto disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importando estudiantes...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-6 h-6 mr-3" />
                Importar {file ? 'archivo' : 'Excel'} a {grupo.nombre}
              </>
            )}
          </button>
        </form>

        {/* Estudiantes Preview */}
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            Estudiantes Actuales 
            <span className="ml-3 px-4 py-2 bg-indigo-100 text-indigo-800 text-lg font-bold rounded-2xl">
              {estudiantes.length}
            </span>
          </h4>
          
          {estudiantesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-lg text-gray-500">Cargando estudiantes...</span>
            </div>
          ) : estudiantes.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
              <UsersIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h5 className="text-xl font-semibold text-gray-900 mb-2">Sin estudiantes</h5>
              <p className="text-gray-500 text-lg">Importa tu Excel para agregar la primera lista</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Apellido</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">Edad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {estudiantes.slice(0, 10).map((estudiante, index) => ( // Show first 10
                    <tr key={estudiante.id_matricula || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{estudiante.nombres}</td>
                      <td className="px-6 py-4 text-gray-700">{estudiante.apellidos}</td>
                      <td className="px-6 py-4 font-mono text-sm bg-gray-100 px-3 py-1 rounded-full">{estudiante.codigo}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">{estudiante.edad}</td>
                    </tr>
                  ))}
                  {estudiantes.length > 10 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        ... y {estudiantes.length - 10} más
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;


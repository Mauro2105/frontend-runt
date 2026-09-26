import { useState } from 'react';
import axios from 'axios';

export default function Dashboard({ onLogout, session }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = 'http://localhost:8000';

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage({ type: '', text: '' });
  };

const handleDownload = async () => {
    try {
      const response = await axios.get(`${API_URL}/descargar-excel/`, {
        responseType: 'blob', // MANTENER: Vital para descargar archivos
        headers: {
          'Authorization': `Bearer ${session.access_token}` // AGREGAR: El carnet de seguridad
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'historial_runt_consolidado.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Detalle del error:", error);
      setMessage({ 
        type: 'error', 
        text: 'Error al descargar el archivo consolidado.' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/procesar-pdf/`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', //Vital para enviar PDFs
          'Authorization': `Bearer ${session.access_token}` // El carnet de seguridad
        },
      });
      
      setFile(null);
      document.getElementById('file-upload').value = ''; 
      
      setMessage({ type: 'success', text: 'Datos procesados correctamente. Generando reporte Excel...' });
      await handleDownload();

    } catch (error) {
      console.error("Detalle del error:", error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Error de conexión con el servidor.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Barra de Navegación Institucional */}
      <nav className="bg-blue-900 px-6 py-4 shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-900 font-bold text-xl">
              CO
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Módulo de Extracción RUNT</h1>
              <p className="text-xs text-blue-200">Sistema Consolidado de Tránsito</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="rounded border border-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 hover:border-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="mx-auto mt-8 max-w-5xl px-6">
        
        {message.text && (
          <div className={`mb-6 rounded-md border-l-4 p-4 text-sm font-medium shadow-sm ${
            message.type === 'success' 
              ? 'border-green-600 bg-green-50 text-green-800' 
              : 'border-red-600 bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          {/* Tarjeta de Carga */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded bg-blue-100 p-2 text-blue-800">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Procesar Documento</h2>
            </div>
            
            <form onSubmit={handleUpload}>
              <label className="mb-2 block text-sm font-medium text-gray-700">Seleccione el reporte PDF</label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="mb-6 block w-full text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={!file || loading}
                className={`w-full rounded-md px-4 py-3 font-bold text-white shadow transition-all ${
                  loading 
                    ? 'cursor-not-allowed bg-orange-500 hover:bg-orange-600' 
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando (30-40s)...
                  </span>
                ) : (
                  'Extraer y Descargar'
                )}
              </button>
            </form>
          </div>

          {/* Tarjeta de Descarga Manual */}
          <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded bg-gray-100 p-2 text-gray-700">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Base de Datos Histórica</h2>
            </div>
            
            <p className="mb-6 flex-grow text-sm leading-relaxed text-gray-600">
              El sistema mantiene un registro seguro de todas las consultas previas en la base de datos central. Descargue aquí el consolidado general actualizado.
            </p>
            
            <button
              onClick={handleDownload}
              className="w-full rounded-md border-2 border-blue-900 bg-white px-4 py-2.5 font-bold text-blue-900 transition hover:bg-blue-50"
            >
              Exportar Consolidado Completo
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
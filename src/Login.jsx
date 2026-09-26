import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Credenciales incorrectas. Verifique su acceso.');
    } else {
      onLogin(data.session);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-sans">
      <div className="fixed top-0 w-full h-2 bg-blue-800"></div>
      
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl border border-gray-200">
        
        <div className="bg-blue-900 px-8 py-6 text-center">
          <h2 className="text-xl font-bold tracking-wide text-white uppercase">Portal Administrativo RUNT</h2>
          <p className="mt-1 text-sm text-blue-200">Sistema Consolidado de Tránsito</p>
        </div>

        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Usuario / Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-blue-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800/20 transition-all"
                placeholder="admin@dominio.com"
                required
              />
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-800 focus:border-blue-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-md bg-blue-800 py-3 font-bold text-white shadow-md transition-all hover:bg-blue-900 hover:shadow-lg disabled:bg-blue-400"
            >
              {loading ? 'Validando credenciales...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t border-gray-100">
          Uso exclusivo para personal autorizado.
        </div>
      </div>
    </div>
  );
}
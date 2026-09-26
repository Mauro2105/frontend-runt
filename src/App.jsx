import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Revisar si ya hay una sesión activa al cargar la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios (cuando el usuario entra o sale)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Si no hay sesión, mostramos el Login
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  // Ahora renderizamos el componente Dashboard real y le pasamos la función de logout
  return <Dashboard onLogout={handleLogout} session={session} />;
}

export default App;

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { findUserByEmail, setCurrentUser, upsertUser } from '../services/storage';
import { initGoogleSignIn } from '../services/googleAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleProfile = (profile: { name: string; email: string }) => {
    const user = {
      id: `google-${Date.now()}`,
      name: profile.name || 'Usuario Google',
      email: profile.email,
      phone: '',
      country: 'Colombia',
      provider: 'google' as const,
      isLoggedIn: true,
      role: 'USER' as const
    };
    upsertUser(user);
    setCurrentUser(user);
    navigate('/dashboard');
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
    if (!clientId) {
      setGoogleError('Configura VITE_GOOGLE_CLIENT_ID para habilitar Google.');
      return;
    }
    if (!googleButtonRef.current) return;

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-identity]');
    if (existingScript) {
      initGoogleSignIn(googleButtonRef.current, clientId, handleGoogleProfile, setErrorMessage);
      setGoogleReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = () => {
      if (!googleButtonRef.current) return;
      initGoogleSignIn(googleButtonRef.current, clientId, handleGoogleProfile, setErrorMessage);
      setGoogleReady(true);
    };
    script.onerror = () => setGoogleError('No se pudo cargar el acceso con Google.');
    document.body.appendChild(script);
  }, []);

  const handleLogin = () => {
    setErrorMessage('');
    const user = findUserByEmail(email);
    if (!user || user.provider === 'google') {
      setErrorMessage('No encontramos una cuenta con ese correo. Regístrate o usa Google.');
      return;
    }
    if (!user.password || user.password !== password) {
      setErrorMessage('La contraseña no es correcta. Intenta nuevamente.');
      return;
    }
    setCurrentUser({ ...user, isLoggedIn: true });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-4xl font-black text-blue-900 italic tracking-tighter">LANGFORD</h2>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-gray-100">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                placeholder="••••••••"
              />
            </div>
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3">
                {errorMessage}
              </div>
            )}
            <button onClick={handleLogin} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-blue-700 hover:bg-blue-800 transition-all">
              Ingresar con mi cuenta
            </button>
            <div ref={googleButtonRef} className="flex justify-center"></div>
            {!googleReady && (
              <div className="text-xs text-gray-500 text-center">
                {googleError || 'Cargando acceso con Google...'}
              </div>
            )}
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-700 font-black">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

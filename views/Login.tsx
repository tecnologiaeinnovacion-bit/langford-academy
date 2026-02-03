
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setStoredUser } from '../services/storage';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    setStoredUser({
      name: 'Usuario Prueba',
      email: 'usuario@langford.test',
      phone: '+57 300 000 0000',
      country: 'Colombia',
      isLoggedIn: true
    });
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
          <div className="space-y-6">
            <button onClick={handleLogin} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-blue-700 hover:bg-blue-800 transition-all">
              Ingresar con mi cuenta
            </button>
            <button className="w-full inline-flex justify-center py-3 px-4 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png" alt="Google" className="h-5 w-5 mr-3" />
              Continuar con Google
            </button>
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

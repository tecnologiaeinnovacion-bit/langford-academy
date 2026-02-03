
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { findUserByEmail, setStoredUser, upsertUser } from '../services/storage';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Colombia',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const existing = findUserByEmail(formData.email);
    if (existing && existing.provider !== 'google') {
      setErrorMessage('Ya existe una cuenta con este correo. Inicia sesión.');
      return;
    }
    const userRecord = {
      id: existing?.id ?? `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      password: formData.password,
      provider: 'local' as const,
      isLoggedIn: true
    };
    upsertUser(userRecord);
    setStoredUser(userRecord);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-black text-blue-900 italic tracking-tighter">LANGFORD</h2>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crea tu cuenta gratis</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold text-blue-700 hover:text-blue-500">Inicia sesión aquí</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-gray-700">Nombre Completo</label>
              <input 
                type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Correo Electrónico</label>
                <input 
                  type="email" required 
                  className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Celular / Móvil</label>
                <input 
                  type="tel" required 
                  className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">País</label>
              <select 
                className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
              >
                <option>Colombia</option>
                <option>México</option>
                <option>Argentina</option>
                <option>Chile</option>
                <option>España</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Contraseña</label>
              <input 
                type="password" required 
                className="mt-1 block w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3">
                {errorMessage}
              </div>
            )}

            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-blue-700 hover:bg-blue-800 focus:outline-none transition-all">
              Registrarme
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500 font-bold uppercase tracking-widest text-[10px]">O continuar con</span></div>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              ¿Prefieres Google? <Link to="/login" className="text-blue-700 font-bold">Ingresa aquí</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

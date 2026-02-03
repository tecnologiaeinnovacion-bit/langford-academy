
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.user === 'admin' && creds.pass === 'admin123') {
      localStorage.setItem('langford_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[40px] border border-[#d4af37]/20 shadow-2xl">
        <div className="text-center mb-10">
          <span className="text-3xl font-black text-[#d4af37] italic tracking-tighter">LANGFORD</span>
          <h2 className="text-white text-xl font-bold mt-4 uppercase tracking-widest">Staff Portal</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Usuario Administrador</label>
            <input 
              type="text" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
              onChange={e => setCreds({...creds, user: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Contraseña</label>
            <input 
              type="password" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
              onChange={e => setCreds({...creds, pass: e.target.value})}
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
          
          <button className="w-full bg-[#d4af37] text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#f1d279] transition-all">
            Acceder al Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearCurrentUser, getCurrentUser } from '../services/storage';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  return (
    <nav className="bg-[#0a0a0a] border-b border-[#d4af37]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-black text-[#d4af37] tracking-tighter italic">LANGFORD</span>
            </Link>
            <div className="hidden md:ml-12 md:flex md:space-x-8">
              <Link to="/" className="text-white hover:text-[#d4af37] px-1 pt-1 text-sm font-bold transition-colors">Explorar</Link>
              <Link to="/dashboard" className="text-gray-400 hover:text-[#d4af37] px-1 pt-1 text-sm font-medium transition-colors">Mi Aprendizaje</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin/dashboard" className="text-gray-400 hover:text-[#d4af37] px-1 pt-1 text-sm font-medium transition-colors">Admin</Link>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-500 group-focus-within:text-[#d4af37]"></i>
              </div>
              <input className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-full bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#d4af37] focus:bg-white/10 transition-all sm:text-sm" placeholder="Buscar maestría..." type="search" />
            </div>
          </div>

          <div className="ml-6 flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-white text-xs font-black uppercase tracking-widest">{user.name}</p>
                  <button onClick={handleLogout} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Salir</button>
                </div>
                <div className="w-10 h-10 bg-[#d4af37] rounded-full flex items-center justify-center font-black text-black">
                  {user.name[0]}
                </div>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-white hover:text-[#d4af37] font-black text-sm transition-colors"
                >
                  Ingresar
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-[#d4af37] hover:bg-[#f1d279] text-black px-7 py-2.5 rounded-full font-black text-sm transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105"
                >
                  Únete Gratis
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

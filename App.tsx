
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import CourseDetail from './views/CourseDetail';
import Dashboard from './views/Dashboard';
import CoursePlayer from './views/CoursePlayer';
import Register from './views/Register';
import Login from './views/Login';
import AdminLogin from './views/AdminLogin';
import AdminDashboard from './views/AdminDashboard';

const App: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthView = ['/login', '/register'].includes(location.pathname);
  const isLearningView = location.pathname.startsWith('/learn/');

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {!isLearningView && !isAuthView && !isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn/:id" element={<CoursePlayer />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      
      {!isLearningView && !isAuthView && !isAdminPath && (
        <footer className="bg-black text-white py-20 px-4 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-3xl font-black mb-8 italic tracking-tighter text-[#d4af37]">LANGFORD</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">La academia definitiva para profesionales que buscan la excelencia. Redefiniendo el estándar educativo en Latinoamérica con tecnología de punta y diseño premium.</p>
            </div>
            <div>
               <h5 className="font-black text-xs uppercase tracking-widest text-[#d4af37] mb-6">Plataforma</h5>
               <ul className="space-y-4 text-gray-400 text-sm font-bold">
                 <li><Link to="/" className="hover:text-white transition-colors">Explorar Catálogo</Link></li>
                 <li><Link to="/dashboard" className="hover:text-white transition-colors">Mi Aprendizaje</Link></li>
                 <li><Link to="/register" className="hover:text-white transition-colors">Programa de Becas</Link></li>
               </ul>
            </div>
            <div>
               <h5 className="font-black text-xs uppercase tracking-widest text-[#d4af37] mb-6">Soporte</h5>
               <ul className="space-y-4 text-gray-400 text-sm font-bold">
                 <li><a href="#" className="hover:text-white transition-colors">Tutoría IA</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                 <li><Link to="/admin" className="text-gray-800 hover:text-gray-600 transition-colors">Staff Portal</Link></li>
               </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <p>© 2025 Langford Global Academy. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Términos</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

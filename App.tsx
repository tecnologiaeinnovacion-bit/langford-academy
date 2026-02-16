
import React, { useEffect, useState } from 'react';
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
import CertificateVerification from './views/CertificateVerification';
import { APP_VERSION } from './constants';
import { getSiteContent } from './services/storage';

const App: React.FC = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthView = ['/login', '/register'].includes(location.pathname);
  const isLearningView = location.pathname.startsWith('/learn/');
  const [siteContent, setSiteContent] = useState(getSiteContent());

  useEffect(() => {
    const handler = () => setSiteContent(getSiteContent());
    window.addEventListener('site-content-updated', handler);
    return () => window.removeEventListener('site-content-updated', handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]" style={{ backgroundColor: siteContent.primaryColor || "#0a0a0a", fontFamily: siteContent.bodyFont || "Inter, sans-serif" }}>
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
          <Route path="/certificates/:id" element={<CertificateVerification />} />
        </Routes>
      </main>
      
      {!isLearningView && !isAuthView && !isAdminPath && (
        <footer className="bg-black text-white py-20 px-4 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-3xl font-black mb-8 italic tracking-tighter text-[#d4af37]">LANGFORD</h4>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm whitespace-pre-line">
                {siteContent.footerNote}
              </p>
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
               <h5 className="font-black text-xs uppercase tracking-widest text-[#d4af37] mb-6">{siteContent.contactTitle}</h5>
               <p className="text-gray-400 text-sm font-bold whitespace-pre-line">{siteContent.contactBody}</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
            <p>© 2025 Langford Global Academy. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              {siteContent.legalLinks.slice(0, 2).map((item) => (
                <span key={item} className="hover:text-white">{item}</span>
              ))}
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <div>
              <p className="text-[#d4af37] mb-3">{siteContent.addressTitle}</p>
              <p className="whitespace-pre-line">{siteContent.addressBody}</p>
            </div>
            <div>
              <p className="text-[#d4af37] mb-3">{siteContent.legalTitle}</p>
              <ul className="space-y-2">
                {siteContent.legalLinks.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[#d4af37] mb-3">{siteContent.hoursTitle}</p>
              <p className="whitespace-pre-line">{siteContent.hoursBody}</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-4 text-[10px] text-gray-600 uppercase tracking-widest font-black">
            Versión {APP_VERSION}
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;

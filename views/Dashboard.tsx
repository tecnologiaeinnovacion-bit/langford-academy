
import React from 'react';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { getCourses, getCurrentUser, getEnrollments, getCourseProgress, getCertificates } from '../services/storage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const allCourses = getCourses();
  
  // Obtener IDs de cursos inscritos
  const enrollmentIds = user ? getEnrollments(user.id ?? '') : [];
  const enrolledCourses = allCourses.filter(c => enrollmentIds.includes(c.id));
  const otherCourses = allCourses.filter(c => !enrollmentIds.includes(c.id));
  const certificates = user ? getCertificates().filter(cert => cert.userId === (user.id ?? '')) : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-20 px-4 text-center">
        <h1 className="text-white text-4xl font-black mb-8">INICIA SESIÓN PARA APRENDER</h1>
        <button onClick={() => navigate('/login')} className="bg-[#d4af37] px-10 py-4 rounded-xl font-black uppercase">Ingresar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex items-center space-x-6">
          <div className="w-20 h-20 bg-[#d4af37] rounded-3xl flex items-center justify-center text-4xl font-black text-black">
            {user.name[0]}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Panel de {user.name.split(' ')[0]}</h1>
            <p className="text-[#d4af37] font-bold uppercase text-[10px] tracking-[4px]">Estudiante de Elite</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-8">Mis Cursos Activos</h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {enrolledCourses.map(c => {
                    const completedLessons = user ? getCourseProgress(user.id ?? '', c.id) : [];
                    const requiredIds = c.modules.flatMap(m => m.lessons).filter(lesson => lesson.required !== false).map(lesson => lesson.id);
                    const totalLessons = requiredIds.length;
                    const progress = totalLessons > 0 ? Math.round((completedLessons.filter(id => requiredIds.includes(id)).length / totalLessons) * 100) : 0;

                    return (
                      <div key={c.id} className="bg-[#111] p-2 rounded-[32px] border border-white/5">
                        <CourseCard course={c} enrolled progress={progress} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white/5 p-10 rounded-3xl border border-dashed border-white/10 text-center">
                   <p className="text-gray-500 mb-6">Aún no te has inscrito en ningún programa.</p>
                   <button onClick={() => navigate('/')} className="text-[#d4af37] font-black uppercase text-xs">Explorar Catálogo</button>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-widest text-gray-400 mb-8">Nuevas Recomendaciones</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherCourses.map(course => (
                  <div key={course.id} className="bg-[#111] p-2 rounded-[32px] border border-white/5">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="space-y-10">
            <div className="bg-[#111] p-8 rounded-[32px] border border-white/5">
              <h3 className="text-lg font-black text-white mb-4">Mis certificados</h3>
              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map(cert => (
                    <div key={cert.id} className="bg-black/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-sm font-bold text-white">{cert.id}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">Emitido {new Date(cert.issuedAt).toLocaleDateString('es-CO')}</p>
                      <button
                        onClick={() => navigate(`/certificates/${cert.id}`)}
                        className="mt-3 text-xs font-black text-[#d4af37] uppercase tracking-widest"
                      >
                        Verificar certificado
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Completa un curso y genera tu certificado.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

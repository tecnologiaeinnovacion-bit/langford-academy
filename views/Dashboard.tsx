
import React from 'react';
import { getStoredCourses } from '../constants';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getEnrollments, getCourseProgress } from '../services/storage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const allCourses = getStoredCourses();
  
  // Obtener IDs de cursos inscritos
  const enrollmentIds = getEnrollments();
  const enrolledCourses = allCourses.filter(c => enrollmentIds.includes(c.id));
  const otherCourses = allCourses.filter(c => !enrollmentIds.includes(c.id));

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
                    const completedLessons = getCourseProgress(c.id);
                    const totalLessons = c.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                    const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

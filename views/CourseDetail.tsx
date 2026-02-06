
import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourses, getCurrentUser, addEnrollment, getEnrollments, getCourseProgress } from '../services/storage';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courses = getCourses();
  const course = courses.find(c => c.id === id);
  const [activeModule, setActiveModule] = useState<string | null>(course?.modules[0]?.id ?? null);
  const user = getCurrentUser();
  const enrollmentIds = user ? getEnrollments(user.id ?? '') : [];
  const isEnrolled = user ? enrollmentIds.includes(course?.id ?? '') : false;
  const completedLessons = user && course ? getCourseProgress(user.id ?? '', course.id) : [];

  const progressPercent = useMemo(() => {
    if (!course || !user) return 0;
    const completed = getCourseProgress(user.id ?? '', course.id);
    const requiredIds = course.modules.flatMap(m => m.lessons).filter(lesson => lesson.required !== false).map(lesson => lesson.id);
    const total = requiredIds.length;
    const done = completed.filter(id => requiredIds.includes(id)).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [course, user]);

  if (!course) return <div className="p-10 text-center font-bold">Curso no encontrado</div>;

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addEnrollment(user.id ?? '', course.id);
    navigate(`/learn/${course.id}`);
  };

  const handleLessonClick = (lessonId: string) => {
    if (isEnrolled) {
      navigate(`/learn/${course.id}?lesson=${lessonId}`);
    } else {
      handleEnrollClick();
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-white">
      {/* Header Premium */}
      <div
        className="bg-[#00255d] text-white py-20 px-4 relative overflow-hidden"
        style={course.bannerImage ? { backgroundImage: `linear-gradient(rgba(0,37,93,0.85), rgba(0,37,93,0.95)), url(${course.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none">
           <i className="fas fa-graduation-cap text-[300px] -rotate-12 translate-x-20 translate-y-20"></i>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative z-10 items-center">
          <div className="md:w-2/3">
            <nav className="flex text-[10px] text-cyan-400 mb-8 font-black uppercase tracking-[4px]">
              <Link to="/" className="hover:text-white transition-colors">Explorar Programas</Link>
              <span className="mx-3 text-white/20">/</span>
              <span>{course.category}</span>
            </nav>
            <h1 className="text-6xl font-black mb-6 leading-[0.9] tracking-tighter">{course.title}</h1>
            <p className="text-xl text-blue-100/70 mb-12 max-w-2xl font-medium leading-relaxed italic border-l-4 border-[#d4af37] pl-6">
              {course.description}
            </p>
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {course.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-cyan-200 border border-cyan-200/30 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {isEnrolled ? (
                <button 
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="w-full sm:w-auto bg-[#d4af37] text-black px-12 py-5 rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-105 transition-all uppercase tracking-widest"
                >
                  Ir al Aula Virtual
                </button>
              ) : (
                <button 
                  onClick={handleEnrollClick}
                  className="w-full sm:w-auto bg-[#d4af37] text-black px-12 py-5 rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-105 transition-all uppercase tracking-widest"
                >
                  Inscribirme Gratis
                </button>
              )}
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest font-black text-blue-100/70">Certificación con PSE</p>
                <div className="flex items-center gap-2 mt-2">
                  <img src="https://www.pse.com.co/o/pse-home-theme/images/logo_pse_footer.png" alt="PSE" className="h-5" />
                  <span className="text-xs font-bold text-cyan-100">Pago seguro al finalizar</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-cyan-400 font-black text-xl">{(course.studentsCount + 2450).toLocaleString()}</p>
                <p className="text-[10px] text-blue-100/50 font-black uppercase tracking-widest">Estudiantes Activos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2">
            <section className="mb-20">
              <h2 className="text-[10px] font-black uppercase tracking-[5px] text-gray-400 mb-6">Descripción del Programa</h2>
              <div className="prose prose-xl text-gray-700 leading-relaxed font-medium">
                {course.longDescription}
              </div>
            </section>

            <section id="syllabus">
              <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
                <h2 className="text-3xl font-black text-gray-900">Plan de Estudios</h2>
                <span className="bg-gray-100 text-gray-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {course.modules.length} Módulos
                </span>
              </div>
              
              <div className="space-y-6">
                {course.modules.length > 0 ? course.modules.map((module, idx) => (
                  <div key={module.id} className="group border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-xl transition-all duration-500">
                    <button 
                      onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                      className={`w-full flex items-center justify-between p-8 text-left transition-colors ${activeModule === module.id ? 'bg-[#00255d] text-white' : 'bg-white hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-6">
                        <span className={`text-2xl font-black ${activeModule === module.id ? 'text-cyan-400' : 'text-gray-300'}`}>0{idx + 1}</span>
                        <span className="font-black text-lg uppercase tracking-tight">{module.title}</span>
                      </div>
                      <i className={`fas fa-chevron-${activeModule === module.id ? 'up' : 'down'} ${activeModule === module.id ? 'text-cyan-400' : 'text-gray-400'}`}></i>
                    </button>
                    
                    {activeModule === module.id && (
                      <div className="p-4 bg-gray-50/50 space-y-2">
                        {module.lessons.map(lesson => (
                          <button 
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson.id)}
                            className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#d4af37] group/lesson transition-all shadow-sm"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover/lesson:bg-[#d4af37]/10 group-hover/lesson:text-[#d4af37] transition-all">
                                <i className={`fas ${lesson.type === 'video' ? 'fa-play' : lesson.type === 'quiz' ? 'fa-pen-to-square' : lesson.type === 'link' ? 'fa-link' : lesson.type === 'file' ? 'fa-file-arrow-down' : lesson.type === 'task' ? 'fa-list-check' : 'fa-file-alt'} text-xs`}></i>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-800 text-sm group-hover/lesson:text-[#d4af37] transition-colors">{lesson.title}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lesson.duration}</p>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                               <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
                                 {completedLessons.includes(lesson.id) ? 'Completado' : 'Entrar Clase'}
                               </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )) : <div className="p-12 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200"><p className="text-gray-400 font-bold">Contenido en preparación...</p></div>}
              </div>
            </section>
          </div>

          <div className="space-y-10">
             <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
                <h3 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-widest">Este curso incluye:</h3>
                <ul className="space-y-6">
                  <li className="flex items-center space-x-4">
                    <i className="fas fa-video text-[#d4af37] text-lg"></i>
                    <span className="text-sm font-bold text-gray-600">Acceso ilimitado a videos HD</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <i className="fas fa-robot text-[#d4af37] text-lg"></i>
                    <span className="text-sm font-bold text-gray-600">Mentoría IA personalizada</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <i className="fas fa-medal text-[#d4af37] text-lg"></i>
                    <span className="text-sm font-bold text-gray-600">Certificación verificable</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <i className="fas fa-mobile-alt text-[#d4af37] text-lg"></i>
                    <span className="text-sm font-bold text-gray-600">Acceso en móvil y web</span>
                  </li>
                </ul>
             </div>

             <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm">
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">Método de pago</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center">
                    <img src="https://www.pse.com.co/o/pse-home-theme/images/logo_pse_footer.png" alt="PSE" className="h-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Pago Seguro en Línea</p>
                    <p className="text-xs text-gray-500">Pago inmediato con bancos colombianos y retorno automático.</p>
                  </div>
                </div>
              </div>

             <div className="bg-[#d4af37]/10 p-10 rounded-[40px] border border-[#d4af37]/30 text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Certificación Oficial</p>
                <p className="text-4xl font-black text-gray-900 mb-6">${course.certificatePrice.toLocaleString('es-CO')}<span className="text-sm text-gray-500">/cop</span></p>
                <p className="text-xs text-gray-600 font-medium mb-8 leading-relaxed">Válido para perfiles de LinkedIn y hojas de vida internacionales.</p>
                <button 
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="w-full bg-[#00255d] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                  {isEnrolled ? `Continuar (${progressPercent}%)` : 'Empieza el curso'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

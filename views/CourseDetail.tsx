
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStoredCourses } from '../constants';
import PSEModal from '../components/PSEModal';
import { addEnrollment, getEnrollments, getStoredUser } from '../services/storage';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courses = getStoredCourses();
  const course = courses.find(c => c.id === id);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isPSEOpen, setIsPSEOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const enrollments = getEnrollments();
    if (course && enrollments.includes(course.id)) {
      setIsEnrolled(true);
    }
    if (course && course.modules.length > 0) {
      setActiveModule(course.modules[0].id);
    }
  }, [course]);

  if (!course) return <div className="p-10 text-center font-bold">Curso no encontrado</div>;

  const handleEnrollClick = () => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login');
      return;
    }

    addEnrollment(course.id);
    setIsEnrolled(true);

    if (course.price > 0) {
      setIsPSEOpen(true);
    } else {
      navigate(`/learn/${course.id}`);
    }
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
      <div className="bg-[#00255d] text-white py-20 px-4 relative overflow-hidden">
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
                  {course.price > 0 ? `Inscribirme por $${course.price.toLocaleString('es-CO')}` : 'Inscribirse Gratis'}
                </button>
              )}
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
                                <i className={`fas ${lesson.type === 'video' ? 'fa-play' : 'fa-file-alt'} text-xs`}></i>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-800 text-sm group-hover/lesson:text-[#d4af37] transition-colors">{lesson.title}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{lesson.duration}</p>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                               <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Entrar Clase</span>
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

             <div className="bg-[#d4af37]/10 p-10 rounded-[40px] border border-[#d4af37]/30 text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Certificación Oficial</p>
                <p className="text-4xl font-black text-gray-900 mb-6">${course.certificatePrice.toLocaleString('es-CO')}<span className="text-sm text-gray-500">/cop</span></p>
                <p className="text-xs text-gray-600 font-medium mb-8 leading-relaxed">Válido para perfiles de LinkedIn y hojas de vida internacionales.</p>
                <button 
                  onClick={handleEnrollClick}
                  className="w-full bg-[#00255d] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                >
                  Garantizar Certificado
                </button>
             </div>
          </div>
        </div>
      </div>

      <PSEModal 
        isOpen={isPSEOpen} 
        onClose={() => setIsPSEOpen(false)} 
        amount={course.price || 0}
        courseTitle={course.title}
        onSuccess={() => {
           setIsEnrolled(true);
           navigate(`/learn/${course.id}`);
        }}
      />
    </div>
  );
};

export default CourseDetail;

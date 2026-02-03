
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getStoredCourses } from '../constants';
import { Lesson } from '../types';
import AIAssistant from '../components/AIAssistant';
import Evaluation from '../components/Evaluation';
import PSEModal from '../components/PSEModal';
import { getCertificateStatus, getCourseProgress, setCertificateStatus, setCourseProgress } from '../services/storage';

const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startLessonId = queryParams.get('lesson');

  const courses = getStoredCourses();
  const course = courses.find(c => c.id === id);
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isPSEOpen, setIsPSEOpen] = useState(false);
  const [isCertificatePaid, setIsCertificatePaid] = useState(false);

  useEffect(() => {
    if (course) {
      setCompletedLessons(getCourseProgress(course.id));
      setIsCertificatePaid(getCertificateStatus(course.id));
      // Si hay una lección en la URL, seleccionarla. Si no, la primera del curso.
      let foundLesson: Lesson | undefined;
      if (startLessonId) {
        course.modules.forEach(m => {
          const l = m.lessons.find(less => less.id === startLessonId);
          if (l) foundLesson = l;
        });
      }
      
      if (foundLesson) {
        setCurrentLesson(foundLesson);
      } else if (!currentLesson) {
        setCurrentLesson(course.modules[0]?.lessons[0] || null);
      }
    }
  }, [course, startLessonId]);

  if (!course) return <div className="p-20 text-center font-bold">Curso no disponible</div>;

  const toggleComplete = (lessonId: string) => {
    if (!course || !lessonId) return;
    setCompletedLessons(prev => {
      const updated = prev.includes(lessonId) ? prev.filter(lid => lid !== lessonId) : [...prev, lessonId];
      setCourseProgress(course.id, updated);
      return updated;
    });
  };

  const totalLessonsCount = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons.length / totalLessonsCount) * 100) : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Top Header Barra de Progreso */}
      <div className="bg-[#111] text-white h-16 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center space-x-6">
          <Link to={`/course/${course.id}`} className="text-gray-500 hover:text-[#d4af37] transition-colors">
            <i className="fas fa-chevron-left"></i>
          </Link>
          <div className="h-8 w-[1px] bg-white/10"></div>
          <div>
            <h1 className="text-[10px] font-black uppercase tracking-[3px] text-[#d4af37] leading-none mb-1">Aula Virtual</h1>
            <p className="text-sm font-bold text-gray-300 truncate max-w-[300px]">{course.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-8">
           <div className="flex items-center space-x-4">
             <div className="w-48 bg-white/5 h-2 rounded-full overflow-hidden hidden sm:block">
                <div className="bg-gradient-to-r from-[#d4af37] to-white h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
             </div>
             <span className="text-xs font-black text-white">{progressPercent}% completado</span>
           </div>
           {progressPercent === 100 && (
             <button 
                onClick={() => setIsPSEOpen(true)}
                className="bg-[#d4af37] text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest animate-pulse"
             >
               Obtener Certificado
             </button>
           )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-black scrollbar-hide">
          <div className="flex-1 flex items-center justify-center p-4 md:p-12 relative">
             <div className="w-full max-w-5xl aspect-video bg-black rounded-[40px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
                {currentLesson?.type === 'video' ? (
                  <video key={currentLesson.id} controls className="w-full h-full object-cover" src={currentLesson.videoUrl}></video>
                ) : currentLesson?.type === 'quiz' ? (
                  <div className="w-full h-full bg-white flex flex-col items-center justify-center">
                    <Evaluation questions={currentLesson.evaluation || []} onComplete={(score) => score >= 70 && toggleComplete(currentLesson.id)} />
                  </div>
                ) : (
                  <div className="w-full h-full bg-white p-20 overflow-y-auto text-black font-medium text-lg leading-relaxed">
                    <h2 className="text-4xl font-black mb-12 border-b-8 border-[#d4af37] inline-block">{currentLesson?.title}</h2>
                    {currentLesson?.content ? (
                       currentLesson.content.split('\n').map((p, idx) => <p key={idx} className="mb-6">{p}</p>)
                    ) : (
                       <p className="text-gray-400 italic">No hay contenido de texto disponible para esta lección.</p>
                    )}
                  </div>
                )}
             </div>
          </div>
          
          <div className="p-10 bg-white/5 border-t border-white/5">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-black text-white">{currentLesson?.title}</h3>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">{currentLesson?.duration} • Recurso Digital Langford</p>
              </div>
              <button 
                onClick={() => toggleComplete(currentLesson?.id || '')} 
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] transition-all ${completedLessons.includes(currentLesson?.id || '') ? 'bg-green-500 text-white' : 'bg-[#d4af37] text-black hover:scale-105'}`}
              >
                {completedLessons.includes(currentLesson?.id || '') ? (
                  <span className="flex items-center"><i className="fas fa-check-circle mr-3"></i> Lección Finalizada</span>
                ) : 'Marcar como completada'}
              </button>
            </div>
          </div>

          {/* Sección de Certificación al 100% */}
          {progressPercent === 100 && (
            <div className="bg-[#d4af37] m-8 p-12 rounded-[50px] text-black text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <i className="fas fa-trophy text-[200px]"></i>
               </div>
               <h2 className="text-5xl font-black mb-4 tracking-tighter">¡PROGRAMA COMPLETADO!</h2>
               <p className="text-lg font-bold mb-10 max-w-2xl mx-auto opacity-80">Has demostrado la disciplina y el talento necesario para pertenecer a la élite Langford. Tu certificado está listo para ser generado.</p>
               
               {isCertificatePaid ? (
                 <div className="space-y-6">
                   <p className="font-black text-green-700 flex items-center justify-center"><i className="fas fa-shield-alt mr-2"></i> PAGO VERIFICADO EXITOSAMENTE</p>
                   <button className="bg-black text-[#d4af37] px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-all flex items-center mx-auto space-x-4">
                     <i className="fas fa-download"></i>
                     <span>DESCARGAR CERTIFICADO ELITE</span>
                   </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setIsPSEOpen(true)}
                   className="bg-black text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-all uppercase tracking-widest shadow-xl"
                 >
                   Obtener Certificación Oficial (${course.certificatePrice.toLocaleString('es-CO')} COP)
                 </button>
               )}
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <div className="w-96 bg-[#111] border-l border-white/5 flex flex-col shrink-0 hidden lg:flex">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[4px]">Plan de Aprendizaje</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module, mIdx) => (
              <div key={module.id} className="border-b border-white/5">
                <div className="px-8 py-4 bg-white/5 text-[10px] font-black text-[#d4af37] uppercase tracking-widest">
                  Módulo 0{mIdx + 1}: {module.title}
                </div>
                {module.lessons.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full flex items-center px-8 py-6 text-left transition-all border-l-4 ${
                      currentLesson?.id === lesson.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'border-transparent hover:bg-white/5'
                    }`}
                  >
                    <div className="mr-5">
                      {completedLessons.includes(lesson.id) ? (
                        <i className="fas fa-check-circle text-green-500 text-xl"></i>
                      ) : (
                        <i className={`fas ${lesson.type === 'video' ? 'fa-play-circle' : 'fa-file-alt'} text-gray-700 text-xl`}></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold leading-snug ${currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-400'}`}>{lesson.title}</p>
                      <p className="text-[10px] text-gray-600 font-black mt-1 uppercase tracking-widest">{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PSEModal 
        isOpen={isPSEOpen} 
        onClose={() => setIsPSEOpen(false)} 
        amount={course.certificatePrice}
        courseTitle={`Certificación Langford: ${course.title}`}
        onSuccess={() => {
          setIsCertificatePaid(true);
          setCertificateStatus(course.id, true);
        }}
      />
      <AIAssistant courseContext={course.longDescription} />
    </div>
  );
};

export default CoursePlayer;

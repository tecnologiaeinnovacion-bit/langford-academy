
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Lesson } from '../types';
import AIAssistant from '../components/AIAssistant';
import Evaluation from '../components/Evaluation';
import PSEModal from '../components/PSEModal';
import { addEnrollment, getCertificates, getCourseProgress, getCourses, getCurrentUser, getEnrollments, setCourseProgress } from '../services/storage';
import { MockPSEProvider } from '../services/paymentProvider';
import { generateCertificatePdf, generateCertificateRecord } from '../services/certificates';

const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startLessonId = queryParams.get('lesson');

  const courses = getCourses();
  const course = courses.find(c => c.id === id);
  const user = getCurrentUser();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isPSEOpen, setIsPSEOpen] = useState(false);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [taskResponse, setTaskResponse] = useState('');

  if (!course) return <div className="p-20 text-center font-bold">Curso no disponible</div>;
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black">Inicia sesión para continuar</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest"
        >
          Ir a Login
        </button>
      </div>
    );
  }

  const existingCertificate = getCertificates().find(cert => cert.courseId === course.id && cert.userId === (user.id ?? ''));

  useEffect(() => {
    if (!user) return;
    if (!getEnrollments(user.id ?? '').includes(course.id)) {
      addEnrollment(user.id ?? '', course.id);
    }
    setCompletedLessons(getCourseProgress(user.id ?? '', course.id));
  }, [course.id, user]);

  useEffect(() => {
    if (!course || !user) return;
    const all = course.modules.flatMap(module => module.lessons);
    const completed = getCourseProgress(user.id ?? '', course.id);
    const isUnlocked = (lessonId: string) => {
      const index = all.findIndex(lesson => lesson.id === lessonId);
      if (index <= 0) return true;
      const previousLessons = all.slice(0, index);
      return previousLessons.filter(lesson => lesson.required !== false).every(lesson => completed.includes(lesson.id));
    };
    let foundLesson: Lesson | undefined;
    if (startLessonId) {
      course.modules.forEach(m => {
        const l = m.lessons.find(less => less.id === startLessonId);
        if (l) foundLesson = l;
      });
    }
    if (foundLesson && !isUnlocked(foundLesson.id)) {
      foundLesson = undefined;
    }
    setCurrentLesson(foundLesson ?? all[0] ?? null);
  }, [course, startLessonId, user]);

  useEffect(() => {
    setTaskResponse('');
  }, [currentLesson?.id]);

  const markComplete = (lessonId: string) => {
    if (!lessonId) return;
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];
      setCourseProgress(user.id ?? '', course.id, updated);
      return updated;
    });
  };

  const allLessons = course.modules.flatMap(module => module.lessons);
  const requiredIds = useMemo(() => {
    return allLessons.filter(lesson => lesson.required !== false).map(lesson => lesson.id);
  }, [allLessons]);
  const totalLessonsCount = requiredIds.length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons.filter(id => requiredIds.includes(id)).length / totalLessonsCount) * 100) : 0;
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
  const isCurrentCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;
  const isCourseCompleted = requiredIds.every(id => completedLessons.includes(id));

  const isLessonUnlocked = (lessonId: string) => {
    const index = allLessons.findIndex(lesson => lesson.id === lessonId);
    if (index <= 0) return true;
    const previousLessons = allLessons.slice(0, index);
    return previousLessons.filter(lesson => lesson.required !== false).every(lesson => completedLessons.includes(lesson.id));
  };

  const handlePaymentConfirm = async () => {
    if (!paymentId || !user) return;
    const payment = MockPSEProvider.confirmPayment(paymentId, 'LANGFORD_PSE_TOKEN');
    if (payment?.status === 'PAID') {
      const record = await generateCertificateRecord(course, user);
      setCertificateId(record.id);
      const pdfUrl = await generateCertificatePdf(course, user, record);
      setCertificateUrl(pdfUrl);
      setIsPSEOpen(false);
    }
  };

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
           {isCourseCompleted && (
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
                {!currentLesson ? (
                  <div className="w-full h-full bg-white flex items-center justify-center text-gray-500 font-bold">
                    Contenido en preparación.
                  </div>
                ) : currentLesson?.type === 'video' ? (
                  currentLesson.videoUrl ? (
                    <iframe
                      title={currentLesson.title}
                      className="w-full h-full"
                      src={currentLesson.videoUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full bg-white flex items-center justify-center text-gray-500 font-bold">
                      No hay video configurado para esta lección.
                    </div>
                  )
                ) : currentLesson?.type === 'quiz' ? (
                  <div className="w-full h-full bg-white flex flex-col items-center justify-center">
                    <Evaluation questions={currentLesson.evaluation || []} onComplete={(score) => score >= 70 && markComplete(currentLesson.id)} />
                  </div>
                ) : currentLesson?.type === 'link' ? (
                  <div className="w-full h-full bg-white p-16 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-link text-5xl text-[#d4af37] mb-6"></i>
                    <h2 className="text-3xl font-black mb-4">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-8">Abre este recurso externo en una nueva pestaña.</p>
                    {currentLesson.externalLink ? (
                      <a
                        href={currentLesson.externalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#00255d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                      >
                        Abrir recurso
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">No hay enlace disponible para este recurso.</p>
                    )}
                  </div>
                ) : currentLesson?.type === 'file' ? (
                  <div className="w-full h-full bg-white p-16 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-file-download text-5xl text-[#d4af37] mb-6"></i>
                    <h2 className="text-3xl font-black mb-4">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-8">Descarga el archivo complementario del curso.</p>
                    {currentLesson.fileUrl ? (
                      <a
                        href={currentLesson.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#00255d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                      >
                        Descargar archivo
                      </a>
                    ) : (
                      <p className="text-gray-400 italic">No hay archivo disponible para este recurso.</p>
                    )}
                  </div>
                ) : currentLesson?.type === 'task' ? (
                  <div className="w-full h-full bg-white p-16 flex flex-col items-center justify-center text-center">
                    <i className="fas fa-list-check text-5xl text-[#d4af37] mb-6"></i>
                    <h2 className="text-3xl font-black mb-4">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-6 max-w-xl">{currentLesson.taskPrompt || 'Completa la actividad para avanzar.'}</p>
                    <textarea
                      value={taskResponse}
                      onChange={(event) => setTaskResponse(event.target.value)}
                      className="w-full max-w-xl border border-gray-200 rounded-2xl p-4 text-sm text-gray-700"
                      placeholder="Escribe tu respuesta..."
                    />
                    <button
                      onClick={() => {
                        if (!taskResponse.trim()) return;
                        markComplete(currentLesson.id);
                        setTaskResponse('');
                      }}
                      className="mt-6 bg-[#00255d] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                    >
                      Enviar y completar
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full bg-white p-20 overflow-y-auto text-black font-medium text-lg leading-relaxed">
                    <h2 className="text-4xl font-black mb-12 border-b-8 border-[#d4af37] inline-block">{currentLesson?.title}</h2>
                    {currentLesson?.content ? (
                       currentLesson.content.split('\n').map((p, idx) => <p key={idx} className="mb-6">{p}</p>)
                    ) : (
                       <p className="text-gray-400 italic">No hay contenido de texto disponible para esta lección.</p>
                    )}
                    {currentLesson?.externalLink && (
                      <div className="mt-8 space-y-4">
                        <p className="text-sm font-bold text-gray-700">Vista previa embebida</p>
                        <div className="aspect-video border border-gray-200 rounded-2xl overflow-hidden">
                          <iframe
                            title="Lectura externa"
                            src={currentLesson.externalLink}
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      </div>
                    )}
                    {currentLesson?.externalLink && (
                      <div className="mt-6">
                        <a
                          href={currentLesson.externalLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-black text-[#00255d] uppercase tracking-widest"
                        >
                          Abrir lectura externa
                        </a>
                      </div>
                    )}
                    {currentLesson && (
                      <button
                        onClick={() => markComplete(currentLesson.id)}
                        className="mt-10 bg-[#00255d] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all"
                      >
                        Marcar lectura como completada
                      </button>
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
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => prevLesson && setCurrentLesson(prevLesson)}
                  disabled={!prevLesson}
                  className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[2px] transition-all ${prevLesson ? 'bg-white/10 text-white hover:scale-105' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                >
                  Anterior
                </button>
                <button 
                  onClick={() => currentLesson && markComplete(currentLesson.id)} 
                  disabled={currentLesson?.type === 'quiz' && !isCurrentCompleted}
                  className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[2px] transition-all ${
                    isCurrentCompleted ? 'bg-green-500 text-white' : 'bg-[#d4af37] text-black hover:scale-105'
                  } ${currentLesson?.type === 'quiz' && !isCurrentCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isCurrentCompleted ? (
                    <span className="flex items-center"><i className="fas fa-check-circle mr-3"></i> Lección Finalizada</span>
                  ) : 'Marcar como completada'}
                </button>
                <button
                  onClick={() => {
                    if (!currentLesson || !nextLesson) return;
                    if (!isCurrentCompleted && currentLesson.required !== false) {
                      return;
                    }
                    setCurrentLesson(nextLesson);
                  }}
                  disabled={!nextLesson || (currentLesson?.required !== false && !isCurrentCompleted)}
                  className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[2px] transition-all ${nextLesson ? 'bg-white/10 text-white hover:scale-105' : 'bg-white/5 text-gray-500 cursor-not-allowed'}`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Sección de Certificación al 100% */}
          {isCourseCompleted && (
            <div className="bg-[#d4af37] m-8 p-12 rounded-[50px] text-black text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <i className="fas fa-trophy text-[200px]"></i>
               </div>
               <h2 className="text-5xl font-black mb-4 tracking-tighter">¡PROGRAMA COMPLETADO!</h2>
               <p className="text-lg font-bold mb-10 max-w-2xl mx-auto opacity-80">Has demostrado la disciplina y el talento necesario para pertenecer a la élite Langford. Tu certificado está listo para ser generado.</p>
               
               {certificateUrl || existingCertificate ? (
                 <div className="space-y-6">
                   <p className="font-black text-green-700 flex items-center justify-center"><i className="fas fa-shield-alt mr-2"></i> PAGO VERIFICADO EXITOSAMENTE</p>
                   {certificateUrl ? (
                     <a
                       href={certificateUrl}
                       download={`Certificado-${course.title}.pdf`}
                       className="bg-black text-[#d4af37] px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-all flex items-center mx-auto space-x-4"
                     >
                       <i className="fas fa-download"></i>
                       <span>DESCARGAR CERTIFICADO ELITE</span>
                     </a>
                   ) : (
                     <button
                       onClick={async () => {
                         const record = existingCertificate || (await generateCertificateRecord(course, user));
                         setCertificateId(record.id);
                         const pdfUrl = await generateCertificatePdf(course, user, record);
                         setCertificateUrl(pdfUrl);
                       }}
                       className="bg-black text-[#d4af37] px-12 py-5 rounded-2xl font-black text-xl hover:scale-110 transition-all flex items-center mx-auto space-x-4"
                     >
                       <i className="fas fa-download"></i>
                       <span>DESCARGAR CERTIFICADO ELITE</span>
                     </button>
                   )}
                   {(certificateId || existingCertificate) && (
                    <button
                      onClick={() => navigate(`/certificates/${certificateId || existingCertificate?.id}`)}
                      className="text-xs font-black uppercase tracking-widest"
                    >
                      Verificar en línea
                    </button>
                   )}
                 </div>
               ) : (
                 <div className="space-y-4">
                   <button 
                     onClick={() => {
                       const payment = MockPSEProvider.createPaymentIntent({
                         userId: user.id ?? 'unknown',
                         courseId: course.id,
                         amount: course.certificatePrice
                       });
                       setPaymentId(payment.id);
                       setIsPSEOpen(true);
                     }}
                     className="px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl transition-all bg-black text-white hover:scale-110"
                   >
                     Obtener Certificación Oficial (${course.certificatePrice.toLocaleString('es-CO')} COP)
                   </button>
                 </div>
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
                  Módulo 0{mIdx + 1}: {module.title}{' '}
                  <span className="text-gray-500">
                    ({module.lessons.filter(lesson => completedLessons.includes(lesson.id)).length}/{module.lessons.length})
                  </span>
                </div>
                {module.lessons.map(lesson => {
                  const isUnlocked = isLessonUnlocked(lesson.id);
                  return (
                  <button
                    key={lesson.id}
                    onClick={() => isUnlocked && setCurrentLesson(lesson)}
                    className={`w-full flex items-center px-8 py-6 text-left transition-all border-l-4 ${
                      currentLesson?.id === lesson.id ? 'bg-[#d4af37]/10 border-[#d4af37]' : 'border-transparent hover:bg-white/5'
                    } ${isUnlocked ? '' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="mr-5">
                      {completedLessons.includes(lesson.id) ? (
                        <i className="fas fa-check-circle text-green-500 text-xl"></i>
                      ) : !isUnlocked ? (
                        <i className="fas fa-lock text-gray-600 text-xl"></i>
                      ) : (
                        <i className={`fas ${lesson.type === 'video' ? 'fa-play-circle' : lesson.type === 'quiz' ? 'fa-pen-to-square' : lesson.type === 'link' ? 'fa-link' : lesson.type === 'file' ? 'fa-file-arrow-down' : lesson.type === 'task' ? 'fa-list-check' : 'fa-file-alt'} text-gray-700 text-xl`}></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold leading-snug ${currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-400'}`}>{lesson.title}</p>
                      <p className="text-[10px] text-gray-600 font-black mt-1 uppercase tracking-widest">{lesson.duration}</p>
                    </div>
                  </button>
                )})}
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
        paymentId={paymentId}
        onConfirm={handlePaymentConfirm}
      />
      <AIAssistant courseContext={course.longDescription} />
    </div>
  );
};

export default CoursePlayer;

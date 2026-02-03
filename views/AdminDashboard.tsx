
import React, { useState, useEffect } from 'react';
import { getStoredCourses } from '../constants';
import { Course, Module, Lesson, ResourceType } from '../types';
import { getStoredUsers, setStoredCoursesRaw } from '../services/storage';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getStoredCourses());
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{courseId: string, moduleId: string, lesson: Lesson} | null>(null);
  const users = getStoredUsers();
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    instructor: '',
    category: 'Tecnología',
    price: 0,
    certificatePrice: 150000,
    modules: []
  });

  // Persistir cambios en localStorage cada vez que se actualiza la lista
  useEffect(() => {
    setStoredCoursesRaw(JSON.stringify(courses));
  }, [courses]);

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    if (!editingLesson) return;
    const { courseId, moduleId } = editingLesson;
    
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              return {
                ...m,
                lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
              };
            }
            return m;
          })
        };
      }
      return c;
    }));
    setEditingLesson(null);
  };

  const handleLessonFieldChange = (field: keyof Lesson, value: string) => {
    if (!editingLesson) return;
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        [field]: value
      }
    });
  };

  const handleLessonTypeChange = (value: ResourceType) => {
    if (!editingLesson) return;
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        type: value,
        videoUrl: value === 'video' ? editingLesson.lesson.videoUrl || '' : undefined,
        content: value === 'reading' ? editingLesson.lesson.content || '' : undefined,
        externalLink: value === 'link' ? editingLesson.lesson.externalLink || '' : undefined,
        fileUrl: value === 'file' ? editingLesson.lesson.fileUrl || '' : undefined,
        evaluation: value === 'quiz' ? editingLesson.lesson.evaluation || [] : undefined
      }
    });
  };

  const handleQuizQuestionChange = (index: number, field: 'question' | 'correctAnswer', value: string | number) => {
    if (!editingLesson || !editingLesson.lesson.evaluation) return;
    const updated = editingLesson.lesson.evaluation.map((q, idx) => {
      if (idx !== index) return q;
      return {
        ...q,
        [field]: value
      };
    });
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        evaluation: updated
      }
    });
  };

  const handleQuizOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    if (!editingLesson || !editingLesson.lesson.evaluation) return;
    const updated = editingLesson.lesson.evaluation.map((q, idx) => {
      if (idx !== questionIndex) return q;
      const newOptions = [...q.options];
      newOptions[optionIndex] = value;
      return {
        ...q,
        options: newOptions
      };
    });
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        evaluation: updated
      }
    });
  };

  const addQuizQuestion = () => {
    if (!editingLesson) return;
    const evaluation = editingLesson.lesson.evaluation || [];
    const updated = [
      ...evaluation,
      {
        id: `q-${Date.now()}`,
        question: 'Nueva pregunta',
        options: ['Opción 1', 'Opción 2', 'Opción 3'],
        correctAnswer: 0
      }
    ];
    setEditingLesson({
      ...editingLesson,
      lesson: {
        ...editingLesson.lesson,
        evaluation: updated
      }
    });
  };

  const addModule = (courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const newMod: Module = { id: Date.now().toString(), title: 'Nuevo Módulo', lessons: [] };
        return { ...c, modules: [...c.modules, newMod] };
      }
      return c;
    }));
  };

  const addLesson = (courseId: string, moduleId: string, type: ResourceType) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              const newLesson: Lesson = {
                id: Date.now().toString(),
                title: 'Nueva Lección',
                duration: '10:00',
                type: type,
                videoUrl: type === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined,
                content: type === 'reading' ? 'Contenido de lectura inicial.' : undefined,
                externalLink: type === 'link' ? 'https://www.ejemplo.com' : undefined,
                fileUrl: type === 'file' ? 'https://www.ejemplo.com/recurso.pdf' : undefined,
                evaluation: type === 'quiz' ? [
                  {
                    id: `q-${Date.now()}`,
                    question: '¿Cuál es el objetivo de esta lección?',
                    options: ['Comprender', 'Memorizar', 'Repetir'],
                    correctAnswer: 0
                  }
                ] : undefined
              };
              return { ...m, lessons: [...m.lessons, newLesson] };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const handleAddCourse = () => {
    const course: Course = {
      ...newCourse as Course,
      id: Math.random().toString(36).substr(2, 9),
      rating: 5.0,
      reviewsCount: 0,
      studentsCount: 0,
      duration: '4 meses',
      level: 'Principiante',
      longDescription: newCourse.description || '',
      instructorTitle: 'Staff Langford',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      modules: []
    };
    setCourses([...courses, course]);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black text-[#d4af37]">PANEL DE CONTROL</h1>
          <div className="flex space-x-4">
             <button onClick={() => window.location.href = '/'} className="px-6 py-3 border border-white/10 rounded-xl font-bold text-xs uppercase">Ver Sitio</button>
             <button onClick={() => setShowAddForm(true)} className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-black">NUEVO CURSO</button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {courses.map(c => (
            <div key={c.id} className="bg-[#111] p-8 rounded-[40px] border border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <img src={c.image} className="w-20 h-20 rounded-3xl object-cover border border-[#d4af37]/20" />
                  <div>
                    <h3 className="text-2xl font-black text-white">{c.title}</h3>
                    <p className="text-xs text-[#d4af37] font-bold uppercase">{c.category}</p>
                  </div>
                </div>
                <button onClick={() => setActiveCourseId(activeCourseId === c.id ? null : c.id)} className="p-4 rounded-2xl bg-white/5 hover:bg-[#d4af37] hover:text-black transition-all">
                  <i className={`fas ${activeCourseId === c.id ? 'fa-times' : 'fa-edit'}`}></i>
                </button>
              </div>

              {activeCourseId === c.id && (
                <div className="mt-8 border-t border-white/5 pt-8 space-y-8 animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest">Currículo</h4>
                    <button onClick={() => addModule(c.id)} className="text-[#d4af37] text-xs font-black uppercase">Añadir Módulo</button>
                  </div>
                  {c.modules.map(m => (
                    <div key={m.id} className="bg-black/40 p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-white">{m.title}</span>
                        <div className="flex flex-wrap gap-2">
                           <button onClick={() => addLesson(c.id, m.id, 'video')} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">+ Video</button>
                           <button onClick={() => addLesson(c.id, m.id, 'reading')} className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-lg">+ Lectura</button>
                           <button onClick={() => addLesson(c.id, m.id, 'link')} className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg">+ Link</button>
                           <button onClick={() => addLesson(c.id, m.id, 'file')} className="text-[10px] bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-lg">+ Archivo</button>
                           <button onClick={() => addLesson(c.id, m.id, 'quiz')} className="text-[10px] bg-pink-500/10 text-pink-400 px-3 py-1 rounded-lg">+ Quiz</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {m.lessons.map(l => (
                          <div key={l.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl text-sm group">
                             <div className="flex items-center space-x-4">
                               <i className={`fas ${l.type === 'video' ? 'fa-play' : l.type === 'quiz' ? 'fa-pen-to-square' : l.type === 'link' ? 'fa-link' : l.type === 'file' ? 'fa-file-arrow-down' : 'fa-file-alt'} text-[#d4af37]`}></i>
                               <span className="font-bold">{l.title}</span>
                             </div>
                             <button onClick={() => setEditingLesson({courseId: c.id, moduleId: m.id, lesson: l})} className="text-gray-500 hover:text-white"><i className="fas fa-cog"></i></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <section className="mt-16 bg-[#111] p-8 rounded-[40px] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white">Usuarios registrados</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-2">Base de datos local</p>
            </div>
            <span className="text-sm font-black text-[#d4af37]">{users.length} usuarios</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {users.map(user => (
              <div key={user.email} className="bg-black/40 p-5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black">{user.provider || 'local'}</span>
                </div>
                <div className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  País: <span className="text-gray-300">{user.country || 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal de edición simplificado */}
        {editingLesson && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] w-full max-w-xl rounded-[40px] border border-[#d4af37]/30 p-10 text-white">
              <h3 className="text-2xl font-black mb-6 text-[#d4af37]">Editar Lección</h3>
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <input
                  className="w-full bg-white/5 p-4 rounded-xl outline-none"
                  value={editingLesson.lesson.title}
                  onChange={e => handleLessonFieldChange('title', e.target.value)}
                  placeholder="Título de la lección"
                />
                <input
                  className="w-full bg-white/5 p-4 rounded-xl outline-none"
                  value={editingLesson.lesson.duration}
                  onChange={e => handleLessonFieldChange('duration', e.target.value)}
                  placeholder="Duración (ej: 12:30)"
                />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold mb-2">Tipo de recurso</p>
                  <select
                    className="w-full bg-white/5 p-4 rounded-xl outline-none"
                    value={editingLesson.lesson.type}
                    onChange={e => handleLessonTypeChange(e.target.value as ResourceType)}
                  >
                    <option value="video">Video</option>
                    <option value="reading">Lectura</option>
                    <option value="link">Link</option>
                    <option value="file">Archivo</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                {editingLesson.lesson.type === 'video' && (
                  <input
                    className="w-full bg-white/5 p-4 rounded-xl outline-none"
                    placeholder="URL Video"
                    value={editingLesson.lesson.videoUrl || ''}
                    onChange={e => handleLessonFieldChange('videoUrl', e.target.value)}
                  />
                )}
                {editingLesson.lesson.type === 'reading' && (
                  <textarea
                    className="w-full bg-white/5 p-4 rounded-xl outline-none h-32"
                    placeholder="Contenido de lectura"
                    value={editingLesson.lesson.content || ''}
                    onChange={e => handleLessonFieldChange('content', e.target.value)}
                  />
                )}
                {editingLesson.lesson.type === 'link' && (
                  <input
                    className="w-full bg-white/5 p-4 rounded-xl outline-none"
                    placeholder="URL del recurso externo"
                    value={editingLesson.lesson.externalLink || ''}
                    onChange={e => handleLessonFieldChange('externalLink', e.target.value)}
                  />
                )}
                {editingLesson.lesson.type === 'file' && (
                  <input
                    className="w-full bg-white/5 p-4 rounded-xl outline-none"
                    placeholder="URL del archivo (PDF, Word, etc.)"
                    value={editingLesson.lesson.fileUrl || ''}
                    onChange={e => handleLessonFieldChange('fileUrl', e.target.value)}
                  />
                )}
                {editingLesson.lesson.type === 'quiz' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Preguntas</p>
                      <button onClick={addQuizQuestion} className="text-[10px] bg-white/10 px-3 py-1 rounded-lg text-[#d4af37] uppercase font-bold">Añadir pregunta</button>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                      {(editingLesson.lesson.evaluation || []).map((question, index) => (
                        <div key={question.id} className="bg-black/40 p-4 rounded-xl space-y-3 border border-white/5">
                          <input
                            className="w-full bg-white/5 p-3 rounded-lg outline-none text-sm"
                            value={question.question}
                            onChange={e => handleQuizQuestionChange(index, 'question', e.target.value)}
                            placeholder="Pregunta"
                          />
                          <div className="grid gap-2">
                            {question.options.map((option, optIndex) => (
                              <input
                                key={optIndex}
                                className="w-full bg-white/5 p-3 rounded-lg outline-none text-sm"
                                value={option}
                                onChange={e => handleQuizOptionChange(index, optIndex, e.target.value)}
                                placeholder={`Opción ${optIndex + 1}`}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400">Respuesta correcta</span>
                            <select
                              className="bg-white/5 p-2 rounded-lg outline-none text-sm"
                              value={question.correctAnswer}
                              onChange={e => handleQuizQuestionChange(index, 'correctAnswer', Number(e.target.value))}
                            >
                              {question.options.map((_, optionIndex) => (
                                <option key={optionIndex} value={optionIndex}>Opción {optionIndex + 1}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => handleUpdateLesson(editingLesson.lesson)} className="w-full bg-[#d4af37] text-black py-4 rounded-xl font-black">GUARDAR</button>
                <button onClick={() => setEditingLesson(null)} className="w-full text-gray-500 py-4 font-bold">CANCELAR</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Añadir Curso */}
        {showAddForm && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] w-full max-w-2xl rounded-[40px] border border-[#d4af37]/30 p-10 text-white">
              <h3 className="text-2xl font-black mb-10 text-[#d4af37]">Nuevo Programa Elite</h3>
              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Título" onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Instructor" onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} />
                <textarea className="w-full bg-white/5 p-5 rounded-2xl outline-none h-32" placeholder="Descripción" onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Precio del curso (0 si es gratis)" type="number" onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Precio del certificado" type="number" onChange={e => setNewCourse({...newCourse, certificatePrice: Number(e.target.value)})} />
                <button onClick={handleAddCourse} className="w-full bg-[#d4af37] text-black py-6 rounded-2xl font-black text-xl">PUBLICAR</button>
                <button onClick={() => setShowAddForm(false)} className="w-full text-gray-500 py-2">Cerrar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

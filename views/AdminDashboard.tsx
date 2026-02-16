
import React, { useState, useEffect } from 'react';
import { Course, Module, Lesson, ResourceType, SiteContent } from '../types';
import { getCertificates, getCourses, getCurrentUser, getPayments, getSiteContent, getUsers, setCourses as setCoursesStore, setSiteContent } from '../services/storage';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getCourses());
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{courseId: string, moduleId: string, lesson: Lesson} | null>(null);
  const users = getUsers();
  const payments = getPayments();
  const certificates = getCertificates();
  const [siteContentState, setSiteContentState] = useState<SiteContent>(getSiteContent());
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black">Acceso restringido</h2>
        <p className="text-gray-500 text-sm">Ingresa como administrador para continuar.</p>
        <button
          onClick={() => window.location.href = '/#/admin'}
          className="bg-[#d4af37] text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest"
        >
          Ir a login admin
        </button>
      </div>
    );
  }
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    instructor: '',
    category: 'Tecnología',
    price: 0,
    certificatePrice: 150000,
    modules: [],
    tags: []
  });

  useEffect(() => {
    setCoursesStore(courses);
  }, [courses]);

  useEffect(() => {
    setSiteContent(siteContentState);
  }, [siteContentState]);

  const handleCourseFieldChange = (courseId: string, field: keyof Course, value: string | number | string[]) => {
    setCourses(prev => prev.map(c => (
      c.id === courseId ? { ...c, [field]: value } : c
    )));
  };

  const handleImageUpload = (courseId: string, field: 'image' | 'bannerImage', file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleCourseFieldChange(courseId, field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleModuleTitleChange = (courseId: string, moduleId: string, value: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        modules: c.modules.map(m => (m.id === moduleId ? { ...m, title: value } : m))
      };
    }));
  };

  const moveModule = (courseId: string, moduleId: string, direction: 'up' | 'down') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const index = c.modules.findIndex(m => m.id === moduleId);
      if (index < 0) return c;
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= c.modules.length) return c;
      const updated = [...c.modules];
      const [moved] = updated.splice(index, 1);
      updated.splice(newIndex, 0, moved);
      return { ...c, modules: updated };
    }));
  };

  const removeModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(c => (
      c.id === courseId ? { ...c, modules: c.modules.filter(m => m.id !== moduleId) } : c
    )));
  };

  const moveLesson = (courseId: string, moduleId: string, lessonId: string, direction: 'up' | 'down') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        modules: c.modules.map(m => {
          if (m.id !== moduleId) return m;
          const index = m.lessons.findIndex(l => l.id === lessonId);
          if (index < 0) return m;
          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= m.lessons.length) return m;
          const updated = [...m.lessons];
          const [moved] = updated.splice(index, 1);
          updated.splice(newIndex, 0, moved);
          return { ...m, lessons: updated };
        })
      };
    }));
  };

  const removeLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        modules: c.modules.map(m => (
          m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
        ))
      };
    }));
  };

  const removeCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

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

  const handleLessonFieldChange = (field: keyof Lesson, value: string | boolean) => {
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
        externalLink: value === 'link' || value === 'reading' ? editingLesson.lesson.externalLink || '' : undefined,
        fileUrl: value === 'file' ? editingLesson.lesson.fileUrl || '' : undefined,
        evaluation: value === 'quiz' ? editingLesson.lesson.evaluation || [] : undefined,
        taskPrompt: value === 'task' ? editingLesson.lesson.taskPrompt || '' : undefined
      }
    });
  };

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvContent = rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuizQuestionChange = (index: number, field: 'question' | 'correctAnswer' | 'explanation', value: string | number) => {
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
                required: true,
                videoUrl: type === 'video' ? 'https://www.youtube.com/embed/aircAruvnKk' : undefined,
                content: type === 'reading' ? 'Contenido de lectura inicial.' : undefined,
                externalLink: type === 'link' ? 'https://www.ejemplo.com' : undefined,
                fileUrl: type === 'file' ? 'https://www.ejemplo.com/recurso.pdf' : undefined,
                evaluation: type === 'quiz' ? [
                  {
                    id: `q-${Date.now()}`,
                    question: '¿Cuál es el objetivo de esta lección?',
                    options: ['Comprender', 'Memorizar', 'Repetir'],
                    correctAnswer: 0,
                    explanation: 'La respuesta correcta es Comprender.'
                  }
                ] : undefined,
                taskPrompt: type === 'task' ? 'Confirma tu aprendizaje en dos frases.' : undefined
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
      longDescription: newCourse.longDescription || newCourse.description || '',
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
                  <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">Datos del curso</h4>
                        <p className="text-xs text-gray-500 font-bold mt-2">Edita títulos, imágenes, precios y descripción en tiempo real.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black">Guardado automático</span>
                        <button
                          onClick={() => removeCourse(c.id)}
                          className="text-[10px] uppercase tracking-widest font-black text-red-400 border border-red-500/30 px-3 py-1 rounded-full"
                        >
                          Eliminar curso
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.title}
                        onChange={e => handleCourseFieldChange(c.id, 'title', e.target.value)}
                        placeholder="Nombre del curso"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.category}
                        onChange={e => handleCourseFieldChange(c.id, 'category', e.target.value)}
                        placeholder="Categoría"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.instructor}
                        onChange={e => handleCourseFieldChange(c.id, 'instructor', e.target.value)}
                        placeholder="Instructor"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.instructorTitle}
                        onChange={e => handleCourseFieldChange(c.id, 'instructorTitle', e.target.value)}
                        placeholder="Cargo del instructor"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.image}
                        onChange={e => handleCourseFieldChange(c.id, 'image', e.target.value)}
                        placeholder="URL de imagen principal"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(c.id, 'image', e.target.files?.[0] ?? null)}
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.bannerImage || ''}
                        onChange={e => handleCourseFieldChange(c.id, 'bannerImage', e.target.value)}
                        placeholder="URL de banner"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(c.id, 'bannerImage', e.target.files?.[0] ?? null)}
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.duration}
                        onChange={e => handleCourseFieldChange(c.id, 'duration', e.target.value)}
                        placeholder="Duración"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        value={c.level}
                        onChange={e => handleCourseFieldChange(c.id, 'level', e.target.value)}
                        placeholder="Nivel"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        type="number"
                        value={c.price}
                        onChange={e => handleCourseFieldChange(c.id, 'price', Number(e.target.value))}
                        placeholder="Precio del curso"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm"
                        type="number"
                        value={c.certificatePrice}
                        onChange={e => handleCourseFieldChange(c.id, 'certificatePrice', Number(e.target.value))}
                        placeholder="Precio certificado"
                      />
                      <textarea
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm md:col-span-2 h-24"
                        value={c.description}
                        onChange={e => handleCourseFieldChange(c.id, 'description', e.target.value)}
                        placeholder="Resumen corto"
                      />
                      <textarea
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm md:col-span-2 h-32"
                        value={c.longDescription}
                        onChange={e => handleCourseFieldChange(c.id, 'longDescription', e.target.value)}
                        placeholder="Descripción larga"
                      />
                      <input
                        className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm md:col-span-2"
                        value={(c.tags || []).join(', ')}
                        onChange={e => handleCourseFieldChange(c.id, 'tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                        placeholder="Tags (separados por coma)"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest">Currículo</h4>
                    <button onClick={() => addModule(c.id)} className="text-[#d4af37] text-xs font-black uppercase">Añadir Módulo</button>
                  </div>
                  {c.modules.map(m => (
                    <div key={m.id} className="bg-black/40 p-6 rounded-3xl border border-white/5">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 w-full">
                          <input
                            className="bg-white/5 p-2 rounded-lg outline-none text-sm font-bold flex-1"
                            value={m.title}
                            onChange={e => handleModuleTitleChange(c.id, m.id, e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <button onClick={() => moveModule(c.id, m.id, 'up')} className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-lg">↑</button>
                            <button onClick={() => moveModule(c.id, m.id, 'down')} className="text-[10px] bg-white/10 text-gray-300 px-2 py-1 rounded-lg">↓</button>
                            <button onClick={() => removeModule(c.id, m.id)} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-1 rounded-lg">Eliminar</button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           <button onClick={() => addLesson(c.id, m.id, 'video')} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">+ Video</button>
                           <button onClick={() => addLesson(c.id, m.id, 'reading')} className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-lg">+ Lectura</button>
                           <button onClick={() => addLesson(c.id, m.id, 'link')} className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg">+ Link</button>
                           <button onClick={() => addLesson(c.id, m.id, 'file')} className="text-[10px] bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-lg">+ Archivo</button>
                           <button onClick={() => addLesson(c.id, m.id, 'quiz')} className="text-[10px] bg-pink-500/10 text-pink-400 px-3 py-1 rounded-lg">+ Quiz</button>
                           <button onClick={() => addLesson(c.id, m.id, 'task')} className="text-[10px] bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg">+ Tarea</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {m.lessons.map(l => (
                          <div key={l.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl text-sm group">
                             <div className="flex items-center space-x-4">
                               <i className={`fas ${l.type === 'video' ? 'fa-play' : l.type === 'quiz' ? 'fa-pen-to-square' : l.type === 'link' ? 'fa-link' : l.type === 'file' ? 'fa-file-arrow-down' : l.type === 'task' ? 'fa-list-check' : 'fa-file-alt'} text-[#d4af37]`}></i>
                               <div>
                                 <span className="font-bold">{l.title}</span>
                                 {l.required !== false && (
                                   <span className="ml-2 text-[10px] uppercase tracking-widest text-green-400 font-black">Obligatoria</span>
                                 )}
                               </div>
                             </div>
                             <div className="flex items-center gap-3">
                               <button onClick={() => moveLesson(c.id, m.id, l.id, 'up')} className="text-[10px] bg-white/10 text-gray-400 px-2 py-1 rounded-lg">↑</button>
                               <button onClick={() => moveLesson(c.id, m.id, l.id, 'down')} className="text-[10px] bg-white/10 text-gray-400 px-2 py-1 rounded-lg">↓</button>
                               <button onClick={() => removeLesson(c.id, m.id, l.id)} className="text-[10px] bg-red-500/10 text-red-300 px-2 py-1 rounded-lg">Eliminar</button>
                               <button onClick={() => setEditingLesson({courseId: c.id, moduleId: m.id, lesson: l})} className="text-gray-500 hover:text-white"><i className="fas fa-cog"></i></button>
                             </div>
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
              <h2 className="text-2xl font-black text-white">Contenido del sitio</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-2">Editable sin tocar código</p>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black">Auto-guardado</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Hero - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.heroTitle}
                onChange={e => setSiteContentState({ ...siteContentState, heroTitle: e.target.value })}
                placeholder="Título del hero"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Hero - CTA</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.heroCta}
                onChange={e => setSiteContentState({ ...siteContentState, heroCta: e.target.value })}
                placeholder="Texto del CTA"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Hero - subtítulo</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.heroSubtitle}
                onChange={e => setSiteContentState({ ...siteContentState, heroSubtitle: e.target.value })}
                placeholder="Subtítulo del hero"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Footer - nota institucional</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.footerNote}
                onChange={e => setSiteContentState({ ...siteContentState, footerNote: e.target.value })}
                placeholder="Nota institucional del footer"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Información - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.infoTitle}
                onChange={e => setSiteContentState({ ...siteContentState, infoTitle: e.target.value })}
                placeholder="Título sección información"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Información - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.infoBody}
                onChange={e => setSiteContentState({ ...siteContentState, infoBody: e.target.value })}
                placeholder="Texto sección información"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Información - bullets</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.infoBullets.join('\n')}
                onChange={e => setSiteContentState({ ...siteContentState, infoBullets: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Bullets (uno por línea)"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Patrocinadores - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.sponsorsTitle}
                onChange={e => setSiteContentState({ ...siteContentState, sponsorsTitle: e.target.value })}
                placeholder="Título patrocinadores"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Patrocinadores - logos</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.sponsorsLogos.join('\n')}
                onChange={e => setSiteContentState({ ...siteContentState, sponsorsLogos: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Logos patrocinadores (1 URL por línea)"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Becas - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.scholarshipTitle}
                onChange={e => setSiteContentState({ ...siteContentState, scholarshipTitle: e.target.value })}
                placeholder="Título becas"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Becas - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.scholarshipBody}
                onChange={e => setSiteContentState({ ...siteContentState, scholarshipBody: e.target.value })}
                placeholder="Texto becas"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Becas - precio</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.scholarshipPrice}
                onChange={e => setSiteContentState({ ...siteContentState, scholarshipPrice: e.target.value })}
                placeholder="Precio certificado"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Becas - CTA</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.scholarshipCta}
                onChange={e => setSiteContentState({ ...siteContentState, scholarshipCta: e.target.value })}
                placeholder="Texto botón becas"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Promociones - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.promosTitle}
                onChange={e => setSiteContentState({ ...siteContentState, promosTitle: e.target.value })}
                placeholder="Título promociones"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Promociones - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.promosBody}
                onChange={e => setSiteContentState({ ...siteContentState, promosBody: e.target.value })}
                placeholder="Texto promociones"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Promociones - highlights</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.promosHighlights.join('\n')}
                onChange={e => setSiteContentState({ ...siteContentState, promosHighlights: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Highlights promociones (uno por línea)"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Contacto - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.contactTitle}
                onChange={e => setSiteContentState({ ...siteContentState, contactTitle: e.target.value })}
                placeholder="Título contacto"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Contacto - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.contactBody}
                onChange={e => setSiteContentState({ ...siteContentState, contactBody: e.target.value })}
                placeholder="Texto contacto"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Dirección - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.addressTitle}
                onChange={e => setSiteContentState({ ...siteContentState, addressTitle: e.target.value })}
                placeholder="Título dirección"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Dirección - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.addressBody}
                onChange={e => setSiteContentState({ ...siteContentState, addressBody: e.target.value })}
                placeholder="Texto dirección"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Legal - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.legalTitle}
                onChange={e => setSiteContentState({ ...siteContentState, legalTitle: e.target.value })}
                placeholder="Título legal"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Legal - enlaces</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.legalLinks.join('\n')}
                onChange={e => setSiteContentState({ ...siteContentState, legalLinks: e.target.value.split('\n').filter(Boolean) })}
                placeholder="Links legales (uno por línea)"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Horario - título</label>
              <input
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2"
                value={siteContentState.hoursTitle}
                onChange={e => setSiteContentState({ ...siteContentState, hoursTitle: e.target.value })}
                placeholder="Título horario"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black">Horario - texto</label>
              <textarea
                className="w-full bg-white/5 p-3 rounded-xl outline-none text-sm mt-2 h-24"
                value={siteContentState.hoursBody}
                onChange={e => setSiteContentState({ ...siteContentState, hoursBody: e.target.value })}
                placeholder="Texto horario"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 bg-[#111] p-8 rounded-[40px] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Exportar datos</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-2">Listos para Google Sheets</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => downloadCsv('usuarios.csv', [
                ['Nombre', 'Email', 'País', 'Rol'],
                ...users.map(user => [user.name, user.email, user.country, user.role || 'USER'])
              ])}
              className="bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Descargar usuarios
            </button>
            <button
              onClick={() => downloadCsv('pagos.csv', [
                ['ID', 'Usuario', 'Curso', 'Monto', 'Estado', 'Fecha'],
                ...payments.map(payment => [payment.id, payment.userId, payment.courseId, payment.amount.toString(), payment.status, payment.createdAt])
              ])}
              className="bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Descargar pagos
            </button>
            <button
              onClick={() => downloadCsv('certificados.csv', [
                ['ID', 'Usuario', 'Curso', 'Fecha', 'Hash'],
                ...certificates.map(cert => [cert.id, cert.userId, cert.courseId, cert.issuedAt, cert.hash])
              ])}
              className="bg-white/10 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Descargar certificados
            </button>
          </div>
        </section>

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
              <div className="space-y-6">
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
                <label className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase">
                  <input
                    type="checkbox"
                    checked={editingLesson.lesson.required !== false}
                    onChange={e => handleLessonFieldChange('required', e.target.checked)}
                    className="accent-[#d4af37]"
                  />
                  Actividad obligatoria
                </label>
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
                    <option value="task">Tarea</option>
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
                  <div className="space-y-4">
                    <input
                      className="w-full bg-white/5 p-4 rounded-xl outline-none"
                      placeholder="URL de lectura externa"
                      value={editingLesson.lesson.externalLink || ''}
                      onChange={e => handleLessonFieldChange('externalLink', e.target.value)}
                    />
                    <textarea
                      className="w-full bg-white/5 p-4 rounded-xl outline-none h-32"
                      placeholder="Contenido de lectura"
                      value={editingLesson.lesson.content || ''}
                      onChange={e => handleLessonFieldChange('content', e.target.value)}
                    />
                  </div>
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
                {editingLesson.lesson.type === 'task' && (
                  <textarea
                    className="w-full bg-white/5 p-4 rounded-xl outline-none h-28"
                    placeholder="Instrucciones de la tarea"
                    value={editingLesson.lesson.taskPrompt || ''}
                    onChange={e => handleLessonFieldChange('taskPrompt', e.target.value)}
                  />
                )}
                {editingLesson.lesson.type === 'quiz' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400 uppercase font-bold">Preguntas</p>
                      <button onClick={addQuizQuestion} className="text-[10px] bg-white/10 px-3 py-1 rounded-lg text-[#d4af37] uppercase font-bold">Añadir pregunta</button>
                    </div>
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
                        <textarea
                          className="w-full bg-white/5 p-3 rounded-lg outline-none text-sm"
                          value={question.explanation || ''}
                          onChange={e => handleQuizQuestionChange(index, 'explanation', e.target.value)}
                          placeholder="Explicación de la respuesta"
                        />
                      </div>
                    ))}
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
              <div className="space-y-6">
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Título" onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Instructor" onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} />
                <textarea className="w-full bg-white/5 p-5 rounded-2xl outline-none h-24" placeholder="Descripción corta" onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
                <textarea className="w-full bg-white/5 p-5 rounded-2xl outline-none h-32" placeholder="Descripción larga" onChange={e => setNewCourse({...newCourse, longDescription: e.target.value})}></textarea>
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Precio del curso (0 si es gratis)" type="number" onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Precio del certificado" type="number" onChange={e => setNewCourse({...newCourse, certificatePrice: Number(e.target.value)})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="Tags (separados por coma)" onChange={e => setNewCourse({...newCourse, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)})} />
                <input className="w-full bg-white/5 p-5 rounded-2xl outline-none" placeholder="URL del banner" onChange={e => setNewCourse({...newCourse, bannerImage: e.target.value})} />
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

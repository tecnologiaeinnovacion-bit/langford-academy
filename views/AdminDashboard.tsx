
import React, { useState, useEffect } from 'react';
import { getStoredCourses } from '../constants';
import { Course, Module, Lesson, ResourceType } from '../types';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getStoredCourses());
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{courseId: string, moduleId: string, lesson: Lesson} | null>(null);
  
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
    localStorage.setItem('langford_courses', JSON.stringify(courses));
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
                videoUrl: type === 'video' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined
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
                        <div className="flex space-x-2">
                           <button onClick={() => addLesson(c.id, m.id, 'video')} className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">+ Video</button>
                           <button onClick={() => addLesson(c.id, m.id, 'reading')} className="text-[10px] bg-green-500/10 text-green-400 px-3 py-1 rounded-lg">+ Texto</button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {m.lessons.map(l => (
                          <div key={l.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl text-sm group">
                             <div className="flex items-center space-x-4">
                               <i className={`fas ${l.type === 'video' ? 'fa-play' : 'fa-file-alt'} text-[#d4af37]`}></i>
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

        {/* Modal de edición simplificado */}
        {editingLesson && (
          <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] w-full max-w-xl rounded-[40px] border border-[#d4af37]/30 p-10 text-white">
              <h3 className="text-2xl font-black mb-6 text-[#d4af37]">Editar Lección</h3>
              <div className="space-y-6">
                <input className="w-full bg-white/5 p-4 rounded-xl outline-none" value={editingLesson.lesson.title} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, title: e.target.value}})} />
                <input className="w-full bg-white/5 p-4 rounded-xl outline-none" placeholder="URL Video" value={editingLesson.lesson.videoUrl || ''} onChange={e => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, videoUrl: e.target.value}})} />
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
                <textarea className="w-full bg-white/5 p-5 rounded-2xl outline-none h-32" placeholder="Descripción" onChange={e => setNewCourse({...newCourse, description: e.target.value})}></textarea>
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

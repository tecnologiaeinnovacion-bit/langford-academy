
import React from 'react';
import { INITIAL_COURSES, TESTIMONIALS, PARTNERS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const courses = INITIAL_COURSES;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/5 blur-[120px] rounded-full -mr-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-7xl font-black leading-[0.9] mb-8 tracking-tighter">
              EDUCACIÓN ELITE <br/>
              <span className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">PARA TODOS.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-medium">
              Aprende de los mejores del mundo sin barreras económicas. Formación gratuita, certificaciones de alto impacto.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#d4af37] text-black px-12 py-5 rounded-full font-black text-xl hover:bg-[#f1d279] transition-all shadow-2xl hover:scale-105"
              >
                Solicitar Beca Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-black uppercase tracking-[5px] text-gray-500 mb-10">Nuestros egresados trabajan en</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            {PARTNERS.map((p, i) => (
              <img key={i} src={p} alt="Partner" className="h-8 md:h-10" />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Beca Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-[40px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <i className="fas fa-certificate text-[150px] text-[#d4af37]"></i>
             </div>
             <div className="flex-1 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#d4af37]">Beca Universal Langford</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  Creemos que el talento es universal, pero las oportunidades no. Por eso, el acceso a todo nuestro material de estudio es **GRATUITO**. Solo pagas por la validación técnica y la emisión de tu certificado físico y digital al finalizar.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center space-x-3 text-white font-bold">
                    <i className="fas fa-check-circle text-[#d4af37]"></i>
                    <span>Acceso a +500 horas de video HD</span>
                  </li>
                  <li className="flex items-center space-x-3 text-white font-bold">
                    <i className="fas fa-check-circle text-[#d4af37]"></i>
                    <span>Tutoría por IA 24/7 sin costo</span>
                  </li>
                </ul>
             </div>
             <div className="w-full md:w-80 bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Costo del Certificado</p>
                <p className="text-5xl font-black text-[#d4af37] mb-6">$150.000<span className="text-sm font-bold text-gray-400">/cop</span></p>
                <button onClick={() => navigate('/register')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all">Empieza Hoy</button>
             </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-black mb-16 text-center">Programas Elite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map(course => (
            <div key={course.id} className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#d4af37]/50 transition-all duration-500 group">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-3xl font-black mb-16 uppercase tracking-widest text-gray-400">Voces de Nuestra Comunidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-[#0a0a0a] p-10 rounded-3xl border border-white/5 hover:border-[#d4af37]/20 transition-all">
                <i className="fas fa-quote-left text-3xl text-[#d4af37] mb-6"></i>
                <p className="text-xl text-gray-300 italic mb-8">"{t.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#d4af37]/20 rounded-full flex items-center justify-center font-black text-[#d4af37]">{t.name[0]}</div>
                  <div>
                    <p className="font-black text-white">{t.name}</p>
                    <p className="text-xs text-[#d4af37] uppercase font-bold tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

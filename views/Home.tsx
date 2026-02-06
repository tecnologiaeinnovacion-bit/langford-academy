
import React, { useMemo, useState } from 'react';
import { TESTIMONIALS, PARTNERS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { getCourses, getSiteContent } from '../services/storage';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const courses = getCourses();
  const siteContent = getSiteContent();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Todos');
  const heroWords = siteContent.heroTitle.split(' ');
  const heroLeading = heroWords.slice(0, 2).join(' ');
  const heroTrailing = heroWords.slice(2).join(' ');
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    courses.forEach(course => course.tags?.forEach(tag => tagSet.add(tag)));
    return ['Todos', ...Array.from(tagSet)];
  }, [courses]);
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesTag = activeTag === 'Todos' || course.tags?.includes(activeTag);
      const matchesSearch = [course.title, course.description, course.category].some(text =>
        text.toLowerCase().includes(search.toLowerCase())
      );
      return matchesTag && matchesSearch;
    });
  }, [activeTag, courses, search]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/5 blur-[120px] rounded-full -mr-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[5px] font-black text-gray-500 mb-6">Langford Global Academy</p>
              <h1 className="text-6xl md:text-7xl font-black leading-[0.9] mb-8 tracking-tighter">
                {heroLeading} <br/>
                <span className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  {heroTrailing}
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-medium">
                {siteContent.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-[#d4af37] text-black px-12 py-5 rounded-full font-black text-xl hover:bg-[#f1d279] transition-all shadow-2xl hover:scale-105"
                >
                  {siteContent.heroCta}
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="border border-white/10 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest text-white hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
                >
                  Ver plataforma
                </button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-check text-[#d4af37]"></i>
                  <span>Pagos seguros con PSE</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-[#d4af37]"></i>
                  <span>Aprende a tu ritmo 24/7</span>
                </div>
              </div>
            </div>
              <div className="bg-gradient-to-br from-[#111] to-[#050505] p-10 rounded-[40px] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Plataforma moderna</p>
                    <h3 className="text-2xl font-black text-white mt-2">Panel de aprendizaje</h3>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black">Nuevo</span>
                </div>
              <div className="space-y-6">
                {['Ruta personalizada de estudio', 'Clases en vivo + recursos descargables', 'Certificados verificables'].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                      <i className="fas fa-check"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">{item}</p>
                      <p className="text-xs text-gray-500 mt-1">Todo el contenido se administra en un panel editable en tiempo real.</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-black/50 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Pago destacado</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://www.pse.com.co/o/pse-home-theme/images/logo_pse_footer.png" alt="PSE" className="h-6" />
                    <span className="text-sm font-bold text-white">PSE disponible en cursos premium</span>
                  </div>
                  <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest">Instantáneo</span>
                </div>
              </div>
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

      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: siteContent.infoTitle, text: siteContent.infoBody },
              { title: 'Pagos PSE integrados', text: 'Transacciones seguras para certificados, con retorno automático a la plataforma.' },
              { title: 'Administración fácil', text: 'Panel editable para mover imágenes, actualizar nombres y ajustar lecturas en segundos.' }
            ].map((card) => (
              <div key={card.title} className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/10">
                <h3 className="text-lg font-black text-white mb-4">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{card.text}</p>
                {card.title === siteContent.infoTitle && siteContent.infoBullets.length > 0 && (
                  <ul className="mt-4 space-y-2 text-xs text-gray-500">
                    {siteContent.infoBullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2">
                        <i className="fas fa-check text-[#d4af37]"></i>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-4xl font-black mb-8 text-center">Programas Elite</h2>
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar cursos, temas o categorías"
                className="w-full bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTag === tag ? 'bg-[#d4af37] text-black' : 'bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses.map(course => (
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

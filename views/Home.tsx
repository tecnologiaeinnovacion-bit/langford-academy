
import React, { useEffect, useMemo, useState } from 'react';
import { TESTIMONIALS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { getCourses, getSiteContent } from '../services/storage';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const courses = getCourses();
  const [siteContent, setSiteContent] = useState(getSiteContent());
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Todos');
  const heroWords = siteContent.heroTitle.split(' ');
  const themeStyle: React.CSSProperties = {
    fontFamily: siteContent.bodyFont || 'Inter, sans-serif',
    ['--brand-accent' as string]: siteContent.accentColor || '#d4af37',
    ['--brand-primary' as string]: siteContent.primaryColor || '#0a0a0a'
  };
  const heroLeading = heroWords.slice(0, 2).join(' ');
  const heroTrailing = heroWords.slice(2).join(' ');
  useEffect(() => {
    const handler = () => setSiteContent(getSiteContent());
    window.addEventListener('site-content-updated', handler);
    return () => window.removeEventListener('site-content-updated', handler);
  }, []);

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
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={themeStyle}>
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#d4af37]/5 blur-[120px] rounded-full -mr-40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[5px] font-black text-gray-500 mb-6">Langford Global Academy</p>
              <h1 className="font-black leading-[0.9] mb-8 tracking-tighter transition-all duration-500" style={{ fontFamily: siteContent.headingFont || 'Inter, sans-serif', fontSize: `${siteContent.heroTitleSize || 64}px` }}>
                {heroLeading} <br/>
                <span className="text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                  {heroTrailing}
                </span>
              </h1>
              <p className="text-gray-400 mb-10 max-w-xl leading-relaxed font-medium transition-all duration-500" style={{ fontSize: `${siteContent.heroSubtitleSize || 20}px` }}>
                {siteContent.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={() => navigate('/register')}
                  className="text-black px-12 py-5 rounded-full font-black text-xl transition-all shadow-2xl hover:scale-105 hover:brightness-110" style={{ backgroundColor: siteContent.accentColor || '#d4af37' }}
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
            <div className="bg-gradient-to-br from-[#111] to-[#050505] p-10 border border-white/10 shadow-2xl transition-transform duration-500 hover:-translate-y-1" style={{ borderRadius: `${siteContent.borderRadius || 32}px` }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{siteContent.promosTitle}</p>
                  <h3 className="text-2xl font-black text-white mt-2" style={{ fontFamily: siteContent.headingFont || 'Inter, sans-serif' }}>{siteContent.promosTitle}</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-black">Actualizado</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">{siteContent.promosBody}</p>
              <div className="space-y-4">
                {siteContent.promosHighlights.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
                      <i className="fas fa-star"></i>
                    </div>
                    <div>
                      <p className="font-bold text-white">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 bg-black/50 rounded-2xl p-5 border border-white/10">
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Pagos disponibles</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="https://www.pse.com.co/o/pse-home-theme/images/logo_pse_footer.png" alt="PSE" className="h-6" />
                    <span className="text-sm font-bold text-white">Certificados con PSE</span>
                  </div>
                  <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest">Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-[10px] font-black uppercase tracking-[5px] text-gray-500 mb-10">{siteContent.sponsorsTitle}</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
            {siteContent.sponsorsLogos.map((p, i) => (
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
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#d4af37]">{siteContent.scholarshipTitle}</h2>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  {siteContent.scholarshipBody}
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
                <p className="text-5xl font-black text-[#d4af37] mb-6">{siteContent.scholarshipPrice}</p>
                <button onClick={() => navigate('/register')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all">{siteContent.scholarshipCta}</button>
             </div>
          </div>
        </div>
      </section>

      {(siteContent.infoTitle || siteContent.infoBody || siteContent.infoBullets.length > 0) && (
        <section className="py-24 bg-black border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#090909] border border-white/10 rounded-[48px] p-12 md:p-16 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[5px] text-gray-500 font-black">Información</p>
                  <h3 className="text-3xl md:text-4xl font-black text-white mt-3">{siteContent.infoTitle}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                  <i className="fas fa-circle-info text-[#d4af37]"></i>
                  <span>Contenido institucional editable</span>
                </div>
              </div>
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
                <div>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed whitespace-pre-line">
                    {siteContent.infoBody}
                  </p>
                </div>
                {siteContent.infoBullets.length > 0 && (
                  <div className="bg-black/40 border border-white/10 rounded-3xl p-6">
                    <h4 className="text-sm font-black text-[#d4af37] uppercase tracking-widest mb-4">Destacados</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                      {siteContent.infoBullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-xs">
                            <i className="fas fa-check"></i>
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

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

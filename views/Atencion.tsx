import React from 'react';

const Atencion: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Atención al Estudiante</h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Nuestro equipo de éxito estudiantil está disponible para acompañarte en todo el proceso de aprendizaje.
          Encuentra los canales oficiales y horarios de respuesta.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Chat Prioritario</h3>
            <p className="text-sm text-gray-400 mt-3">Atendemos 24/7 para estudiantes activos.</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Tiempo promedio: 4 min</p>
          </div>
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Correo de soporte</h3>
            <p className="text-sm text-gray-400 mt-3">soporte@langford.academy</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Lunes a sábado</p>
          </div>
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">WhatsApp Elite</h3>
            <p className="text-sm text-gray-400 mt-3">+57 300 000 0000</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Respuestas en menos de 1 hora</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Atencion;

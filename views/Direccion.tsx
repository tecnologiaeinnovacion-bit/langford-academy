import React from 'react';

const Direccion: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Dirección & Presencia</h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Langford Academy opera de manera híbrida con sedes estratégicas y soporte digital en toda Latinoamérica.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Sede Principal</h3>
            <p className="text-sm text-gray-400 mt-3">Calle 93 #13-45, Bogotá, Colombia</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Horario: 8:00 - 18:00</p>
          </div>
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Centro Virtual</h3>
            <p className="text-sm text-gray-400 mt-3">Aulas en vivo, mentorías y simuladores 100% online.</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Cobertura 24/7</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Direccion;

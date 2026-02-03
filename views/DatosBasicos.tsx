import React from 'react';

const DatosBasicos: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-black mb-6">Datos Básicos</h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          Información corporativa y legal para alianzas, acreditaciones y procesos de contratación.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Razón Social</h3>
            <p className="text-sm text-gray-400 mt-3">Langford Global Academy S.A.S.</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">NIT: 900.123.456-7</p>
          </div>
          <div className="bg-[#111] p-8 rounded-3xl border border-white/5">
            <h3 className="text-lg font-black text-[#d4af37]">Representante Legal</h3>
            <p className="text-sm text-gray-400 mt-3">Dr. Julian Langford</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6">Contactos institucionales</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatosBasicos;

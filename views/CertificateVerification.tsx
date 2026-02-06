import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCertificateById, getCourses, getUsers } from '../services/storage';

const CertificateVerification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const certificate = id ? getCertificateById(id) : null;
  const courses = getCourses();
  const users = getUsers();

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center space-y-6">
        <h2 className="text-2xl font-black">Certificado no encontrado</h2>
        <Link to="/" className="text-[#d4af37] font-black uppercase tracking-widest text-xs">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const course = courses.find(item => item.id === certificate.courseId);
  const user = users.find(item => item.id === certificate.userId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-3xl mx-auto bg-[#111] border border-white/10 rounded-[40px] p-10 text-center">
        <p className="text-[10px] uppercase tracking-widest font-black text-gray-500">Verificación de certificado</p>
        <h1 className="text-3xl font-black mt-4 mb-8 text-[#d4af37]">{certificate.id}</h1>
        <div className="space-y-4 text-sm text-gray-300">
          <p><span className="text-gray-500">Estudiante:</span> {user?.name || 'No disponible'}</p>
          <p><span className="text-gray-500">Curso:</span> {course?.title || 'No disponible'}</p>
          <p><span className="text-gray-500">Fecha de emisión:</span> {new Date(certificate.issuedAt).toLocaleDateString('es-CO')}</p>
          <p><span className="text-gray-500">Hash:</span> {certificate.hash}</p>
        </div>
        <div className="mt-10">
          <Link to="/" className="text-xs font-black uppercase tracking-widest text-[#d4af37]">Explorar más cursos</Link>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;

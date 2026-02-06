import { Course, CertificateRecord, User } from '../types';
import { sha256 } from './crypto';
import { upsertCertificate } from './storage';

const escapePdfText = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const buildPdf = (lines: { text: string; x: number; y: number; size: number }[]) => {
  const objects: string[] = [];
  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');
  objects.push('2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj');
  objects.push('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj');

  const content = [
    'BT',
    ...lines.map(line => `/F1 ${line.size} Tf ${line.x} ${line.y} Td (${escapePdfText(line.text)}) Tj`),
    'ET'
  ].join('\n');
  objects.push(`4 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`);
  objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj');

  let offset = 0;
  const xref: string[] = ['xref', `0 ${objects.length + 1}`, '0000000000 65535 f '];
  const body = objects
    .map(obj => {
      const entry = obj + '\n';
      const padded = offset.toString().padStart(10, '0');
      xref.push(`${padded} 00000 n `);
      offset += entry.length;
      return entry;
    })
    .join('');

  const xrefOffset = offset;
  const trailer = `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return `%PDF-1.4\n${body}${xref.join('\n')}\n${trailer}`;
};

export const generateCertificateRecord = async (course: Course, user: User) => {
  const rawId = `${course.id}-${user.id}-${Date.now()}`;
  const hash = await sha256(rawId);
  const record: CertificateRecord = {
    id: `CERT-${hash.slice(0, 12).toUpperCase()}`,
    userId: user.id ?? 'unknown',
    courseId: course.id,
    issuedAt: new Date().toISOString(),
    hash
  };
  upsertCertificate(record);
  return record;
};

export const generateCertificatePdf = async (course: Course, user: User, record: CertificateRecord) => {
  const date = new Date(record.issuedAt).toLocaleDateString('es-CO');
  const lines = [
    { text: 'LANGFORD ACADEMY', x: 250, y: 520, size: 24 },
    { text: 'CERTIFICADO DE FINALIZACIÓN', x: 210, y: 490, size: 16 },
    { text: user.name, x: 260, y: 440, size: 22 },
    { text: `ha completado el programa ${course.title}`, x: 120, y: 410, size: 12 },
    { text: `Fecha de emisión: ${date}`, x: 120, y: 160, size: 10 },
    { text: `Código: ${record.id}`, x: 120, y: 145, size: 10 },
    { text: `Verificación: /certificates/${record.id}`, x: 120, y: 130, size: 10 }
  ];
  const pdfContent = buildPdf(lines);
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

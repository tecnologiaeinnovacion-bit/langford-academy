
import { Course, SiteContent } from './types';

export const INITIAL_COURSES_DATA: Course[] = [
  {
    id: '1',
    title: 'Maestría en Inteligencia Artificial',
    instructor: 'Dr. Julian Langford',
    instructorTitle: 'PhD en Computer Science',
    description: 'El programa más exclusivo para dominar la IA generativa y redes neuronales.',
    longDescription: 'Únete a la élite tecnológica. Este curso cubre desde los fundamentos hasta arquitecturas complejas de Transformers y RLHF.',
    rating: 5.0,
    reviewsCount: 1240,
    studentsCount: 8500,
    duration: '6 meses',
    level: 'Avanzado',
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    price: 0,
    certificatePrice: 150000,
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Arquitecturas Modernas',
        lessons: [
          { id: 'l1', title: 'Introducción a Transformers', duration: '15:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', required: true },
          { id: 'l1b', title: 'Lectura guiada: atención y contexto', duration: '08:00', type: 'reading', externalLink: 'https://blog.google/technology/ai/transformer/', content: 'Lee el artículo y responde la tarea corta al final.', required: true },
          { id: 'l2', title: 'Evaluación de Entrada', duration: '10:00', type: 'quiz', evaluation: [
            { id: 'q1', question: '¿Qué significa GPT?', options: ['Generative Pre-trained Transformer', 'General Protocol Transfer', 'Global Process Tool'], correctAnswer: 0, explanation: 'GPT corresponde a Generative Pre-trained Transformer.' }
          ], required: true },
          { id: 'l3', title: 'Actividad práctica', duration: '05:00', type: 'task', taskPrompt: 'Confirma que completaste la lectura y resume en 2 frases el concepto de atención.', required: true }
        ]
      }
    ],
    tags: ['IA', 'Deep Learning', 'Transformer'],
    bannerImage: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&q=80&w=1400'
  }
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Educación premium para carreras reales',
  heroSubtitle: 'Aprendizaje guiado, contenidos gratuitos y certificación inmediata cuando completes el programa.',
  heroCta: 'Explorar programas',
  infoTitle: 'Tu avance es el centro de todo',
  infoBody: 'Cada curso es secuencial, con actividades obligatorias y feedback inmediato. Cuando terminas, puedes pagar tu certificado y descargarlo al instante.',
  infoBullets: ['Progreso visible por módulo y curso', 'Pagos PSE listos para activar', 'Certificados verificables en línea']
};

export const TESTIMONIALS = [
  { name: 'Andrea Ruiz', role: 'Data Scientist en Google', text: 'Langford cambió mi carrera. La certificación es reconocida globalmente.' },
  { name: 'Carlos Slim', role: 'Analista en JP Morgan', text: 'La flexibilidad y la calidad de los mentores es inigualable.' }
];

export const PARTNERS = [
  'https://logo.clearbit.com/google.com',
  'https://logo.clearbit.com/microsoft.com',
  'https://logo.clearbit.com/amazon.com',
  'https://logo.clearbit.com/goldmansachs.com'
];

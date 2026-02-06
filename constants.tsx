
import { Course, SiteContent } from './types';

export const APP_VERSION = '1.3.0';

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
  ,
  {
    id: '2',
    title: 'MBA Ejecutivo en Transformación Digital',
    instructor: 'Laura Montoya',
    instructorTitle: 'Directora de Innovación',
    description: 'Lidera la modernización empresarial con estrategia, datos y automatización.',
    longDescription: 'Diseñado para líderes que necesitan acelerar la digitalización con foco en procesos, cultura y rentabilidad.',
    rating: 4.9,
    reviewsCount: 980,
    studentsCount: 6200,
    duration: '5 meses',
    level: 'Intermedio',
    category: 'Negocios',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
    price: 0,
    certificatePrice: 180000,
    modules: [
      {
        id: 'm2-1',
        title: 'Módulo 1: Estrategia Digital',
        lessons: [
          { id: 'm2-l1', title: 'Visión y roadmap', duration: '12:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/2ePf9rue1Ao', required: true },
          { id: 'm2-l2', title: 'Lectura: Transformación efectiva', duration: '10:00', type: 'reading', externalLink: 'https://hbr.org/', content: 'Analiza un caso real y define 3 aprendizajes.', required: true },
          { id: 'm2-l3', title: 'Quiz diagnóstico', duration: '08:00', type: 'quiz', required: true, evaluation: [
            { id: 'm2-q1', question: '¿Qué habilita la transformación?', options: ['Tecnología sola', 'Estrategia + cultura', 'Publicidad'], correctAnswer: 1, explanation: 'La transformación requiere estrategia y cultura.' }
          ] }
        ]
      }
    ],
    tags: ['Transformación', 'Liderazgo', 'Estrategia'],
    bannerImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1400'
  },
  {
    id: '3',
    title: 'Finanzas Corporativas Avanzadas',
    instructor: 'Carlos Vega',
    instructorTitle: 'CFO',
    description: 'Modelo financiero, valoración y gestión de riesgo para líderes de finanzas.',
    longDescription: 'Aprende a estructurar decisiones de inversión y optimizar capital en contextos competitivos.',
    rating: 4.8,
    reviewsCount: 760,
    studentsCount: 4300,
    duration: '4 meses',
    level: 'Avanzado',
    category: 'Finanzas',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=800',
    price: 0,
    certificatePrice: 170000,
    modules: [
      {
        id: 'm3-1',
        title: 'Módulo 1: Valoración',
        lessons: [
          { id: 'm3-l1', title: 'DCF aplicado', duration: '14:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/1Q3l93Q5Tjw', required: true },
          { id: 'm3-l2', title: 'Lectura: métricas clave', duration: '08:00', type: 'reading', externalLink: 'https://www.investopedia.com/', content: 'Identifica las métricas críticas para evaluar proyectos.', required: true },
          { id: 'm3-l3', title: 'Actividad práctica', duration: '06:00', type: 'task', taskPrompt: 'Sube 3 riesgos financieros de tu industria.', required: true }
        ]
      }
    ],
    tags: ['Finanzas', 'Valoración', 'Riesgo'],
    bannerImage: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&q=80&w=1400'
  },
  {
    id: '4',
    title: 'Diseño de Producto Digital',
    instructor: 'Andrea Salazar',
    instructorTitle: 'Product Lead',
    description: 'De investigación a lanzamiento con métricas y enfoque centrado en resultados.',
    longDescription: 'Aprende discovery, prototipado, priorización y medición para equipos de producto modernos.',
    rating: 4.9,
    reviewsCount: 1120,
    studentsCount: 5100,
    duration: '3 meses',
    level: 'Intermedio',
    category: 'Producto',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=800',
    price: 0,
    certificatePrice: 160000,
    modules: [
      {
        id: 'm4-1',
        title: 'Módulo 1: Discovery',
        lessons: [
          { id: 'm4-l1', title: 'Entrevistas de usuario', duration: '11:00', type: 'video', videoUrl: 'https://www.youtube.com/embed/6ZfuNTqbHE8', required: true },
          { id: 'm4-l2', title: 'Lectura: Product strategy', duration: '09:00', type: 'reading', externalLink: 'https://www.nngroup.com/', content: 'Resume 2 aprendizajes aplicables a tu producto.', required: true },
          { id: 'm4-l3', title: 'Quiz de producto', duration: '07:00', type: 'quiz', required: true, evaluation: [
            { id: 'm4-q1', question: '¿Qué define un MVP?', options: ['Completo', 'Aprendizaje validado', 'Mínimo diseño'], correctAnswer: 1, explanation: 'MVP es aprendizaje validado con el menor esfuerzo.' }
          ] }
        ]
      }
    ],
    tags: ['Producto', 'UX', 'Discovery'],
    bannerImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400'
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

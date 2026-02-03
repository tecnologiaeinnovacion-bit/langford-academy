
import { Course } from './types';
import { safeParse, getStoredCoursesRaw, setStoredCoursesRaw } from './services/storage';

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
          { id: 'l1', title: 'Introducción a Transformers', duration: '15:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'l2', title: 'Evaluación de Entrada', duration: '10:00', type: 'quiz', evaluation: [
            { id: 'q1', question: '¿Qué significa GPT?', options: ['Generative Pre-trained Transformer', 'General Protocol Transfer', 'Global Process Tool'], correctAnswer: 0 }
          ]}
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Diplomado en Liderazgo Ejecutivo',
    instructor: 'Dra. Valentina Ríos',
    instructorTitle: 'MBA, Harvard Business School',
    description: 'Desarrolla habilidades de liderazgo, estrategia y gestión de alto impacto.',
    longDescription: 'Aprende a liderar equipos de alto rendimiento, gestionar cambios y tomar decisiones con visión estratégica.',
    rating: 4.9,
    reviewsCount: 680,
    studentsCount: 5200,
    duration: '4 meses',
    level: 'Intermedio',
    category: 'Negocios',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
    price: 120000,
    certificatePrice: 150000,
    modules: [
      {
        id: 'm2-1',
        title: 'Módulo 1: Fundamentos del Liderazgo',
        lessons: [
          { id: 'm2-l1', title: 'Liderazgo Situacional', duration: '12:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
          { id: 'm2-l2', title: 'Lectura: Cultura de Alto Rendimiento', duration: '20:00', type: 'reading', content: 'Explora modelos de cultura organizacional y prácticas de liderazgo consciente.' },
          { id: 'm2-l3', title: 'Recurso externo: Conferencia TED', duration: '08:00', type: 'link', externalLink: 'https://www.youtube.com/watch?v=U6n2NcJ7rLc' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Certificación en Diseño UX/UI',
    instructor: 'Ing. Paula Méndez',
    instructorTitle: 'Lead Product Designer',
    description: 'Domina los procesos de investigación, diseño y validación de experiencias digitales.',
    longDescription: 'Crea productos digitales centrados en usuarios con metodologías ágiles, prototipado y testing.',
    rating: 4.8,
    reviewsCount: 940,
    studentsCount: 7600,
    duration: '5 meses',
    level: 'Principiante',
    category: 'Diseño',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    price: 0,
    certificatePrice: 150000,
    modules: [
      {
        id: 'm3-1',
        title: 'Módulo 1: Research y Estrategia',
        lessons: [
          { id: 'm3-l1', title: 'Introducción al UX Research', duration: '14:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
          { id: 'm3-l2', title: 'Guía PDF de entrevistas', duration: '10:00', type: 'file', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'm3-l3', title: 'Quiz: Roles UX', duration: '07:00', type: 'quiz', evaluation: [
            { id: 'm3-q1', question: '¿Cuál es el rol principal del UX Research?', options: ['Validar ideas con usuarios', 'Solo diseñar pantallas', 'Programar interfaces'], correctAnswer: 0 }
          ]}
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Bootcamp de Analítica de Datos',
    instructor: 'MSc. Andrés León',
    instructorTitle: 'Data Analytics Manager',
    description: 'Aprende análisis de datos, visualización y storytelling para negocios.',
    longDescription: 'Explora herramientas clave de análisis, crea dashboards y comunica resultados con impacto.',
    rating: 4.9,
    reviewsCount: 1120,
    studentsCount: 9100,
    duration: '6 meses',
    level: 'Intermedio',
    category: 'Data',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    price: 90000,
    certificatePrice: 150000,
    modules: [
      {
        id: 'm4-1',
        title: 'Módulo 1: Data Foundations',
        lessons: [
          { id: 'm4-l1', title: 'Introducción a Power BI', duration: '18:00', type: 'video', videoUrl: 'https://www.w3schools.com/html/movie.mp4' },
          { id: 'm4-l2', title: 'Lectura: Storytelling con datos', duration: '15:00', type: 'reading', content: 'Frameworks para construir narrativas que impulsen decisiones.' },
          { id: 'm4-l3', title: 'Recurso externo: Dashboard inspiration', duration: '05:00', type: 'link', externalLink: 'https://www.youtube.com/watch?v=3x5LrfxVvUg' }
        ]
      }
    ]
  }
];

export const getStoredCourses = (): Course[] => {
  const stored = getStoredCoursesRaw();
  if (stored) return safeParse<Course[]>(stored, INITIAL_COURSES_DATA);
  setStoredCoursesRaw(JSON.stringify(INITIAL_COURSES_DATA));
  return INITIAL_COURSES_DATA;
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

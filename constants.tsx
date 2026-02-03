
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

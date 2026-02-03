
export type ResourceType = 'video' | 'quiz' | 'reading' | 'link' | 'file';

export interface EvaluationQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: ResourceType;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  externalLink?: string;
  evaluation?: EvaluationQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorTitle: string;
  description: string;
  longDescription: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  image: string;
  modules: Module[];
  price: number; // Precio del curso (0 si es gratis)
  certificatePrice: number; // Precio para descargar el certificado
  sponsoredBy?: string;
  sponsorLogo?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  country: string;
  isLoggedIn: boolean;
}

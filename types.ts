
export type ResourceType = 'video' | 'quiz' | 'reading' | 'link' | 'file' | 'task';

export interface EvaluationQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: ResourceType;
  required?: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  externalLink?: string;
  evaluation?: EvaluationQuestion[];
  taskPrompt?: string;
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
  tags?: string[];
  bannerImage?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  provider?: 'local' | 'google';
  password?: string;
  isLoggedIn: boolean;
  role?: 'USER' | 'ADMIN';
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface PaymentRecord {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: PaymentStatus;
  provider: 'MockPSE';
  token: string;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  hash: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  infoTitle: string;
  infoBody: string;
  infoBullets: string[];
}

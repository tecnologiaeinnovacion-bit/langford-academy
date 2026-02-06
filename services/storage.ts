import { Course, CertificateRecord, PaymentRecord, SiteContent, User } from '../types';
import { DEFAULT_SITE_CONTENT, INITIAL_COURSES_DATA } from '../constants';
import { getDbItem, setDbItem } from './db';

type EnrollmentMap = Record<string, string[]>;
type ProgressMap = Record<string, Record<string, string[]>>;

const STORAGE_KEYS = {
  courses: 'courses',
  users: 'users',
  enrollments: 'enrollments',
  progress: 'progress',
  payments: 'payments',
  certificates: 'certificates',
  siteContent: 'site-content',
  currentUserId: 'current-user-id'
};

const cache = {
  courses: INITIAL_COURSES_DATA as Course[],
  users: [] as User[],
  enrollments: {} as EnrollmentMap,
  progress: {} as ProgressMap,
  payments: [] as PaymentRecord[],
  certificates: [] as CertificateRecord[],
  siteContent: DEFAULT_SITE_CONTENT as SiteContent,
  currentUserId: null as string | null
};

let isInitialized = false;

export const initStorage = async () => {
  if (isInitialized) return;
  cache.courses = await getDbItem<Course[]>(STORAGE_KEYS.courses, INITIAL_COURSES_DATA);
  cache.users = await getDbItem<User[]>(STORAGE_KEYS.users, []);
  cache.enrollments = await getDbItem<EnrollmentMap>(STORAGE_KEYS.enrollments, {});
  cache.progress = await getDbItem<ProgressMap>(STORAGE_KEYS.progress, {});
  cache.payments = await getDbItem<PaymentRecord[]>(STORAGE_KEYS.payments, []);
  cache.certificates = await getDbItem<CertificateRecord[]>(STORAGE_KEYS.certificates, []);
  cache.siteContent = await getDbItem<SiteContent>(STORAGE_KEYS.siteContent, DEFAULT_SITE_CONTENT);
  cache.currentUserId = await getDbItem<string | null>(STORAGE_KEYS.currentUserId, null);

  if (cache.users.length === 0) {
    cache.users = [
      {
        id: 'admin-1',
        name: 'Administrador Langford',
        email: 'admin@langford.edu',
        phone: '',
        country: 'Colombia',
        password: 'admin123',
        provider: 'local',
        isLoggedIn: false,
        role: 'ADMIN'
      }
    ];
    await setDbItem(STORAGE_KEYS.users, cache.users);
  }

  await Promise.all([
    setDbItem(STORAGE_KEYS.courses, cache.courses),
    setDbItem(STORAGE_KEYS.enrollments, cache.enrollments),
    setDbItem(STORAGE_KEYS.progress, cache.progress),
    setDbItem(STORAGE_KEYS.payments, cache.payments),
    setDbItem(STORAGE_KEYS.certificates, cache.certificates),
    setDbItem(STORAGE_KEYS.siteContent, cache.siteContent),
    setDbItem(STORAGE_KEYS.currentUserId, cache.currentUserId)
  ]);

  isInitialized = true;
};

const persist = <T>(key: string, value: T) => {
  setDbItem(key, value).catch((error) => {
    console.error('Storage error:', error);
  });
};

export const getCourses = (): Course[] => cache.courses;

export const setCourses = (courses: Course[]) => {
  cache.courses = courses;
  persist(STORAGE_KEYS.courses, courses);
};

export const getSiteContent = (): SiteContent => cache.siteContent;

export const setSiteContent = (content: SiteContent) => {
  cache.siteContent = content;
  persist(STORAGE_KEYS.siteContent, content);
};

export const getUsers = (): User[] => cache.users;

export const setUsers = (users: User[]) => {
  cache.users = users;
  persist(STORAGE_KEYS.users, users);
};

export const upsertUser = (user: User) => {
  const users = [...cache.users];
  const existingIndex = users.findIndex(existing => existing.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  setUsers(users);
};

export const findUserByEmail = (email: string) => {
  return cache.users.find(user => user.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const getCurrentUser = (): User | null => {
  if (!cache.currentUserId) return null;
  return cache.users.find(user => user.id === cache.currentUserId) ?? null;
};

export const setCurrentUser = (user: User) => {
  cache.currentUserId = user.id ?? null;
  persist(STORAGE_KEYS.currentUserId, cache.currentUserId);
  upsertUser({ ...user, isLoggedIn: true });
};

export const clearCurrentUser = () => {
  if (cache.currentUserId) {
    const user = cache.users.find(item => item.id === cache.currentUserId);
    if (user) {
      upsertUser({ ...user, isLoggedIn: false });
    }
  }
  cache.currentUserId = null;
  persist(STORAGE_KEYS.currentUserId, cache.currentUserId);
};

export const getEnrollments = (userId: string): string[] => {
  return cache.enrollments[userId] ?? [];
};

export const addEnrollment = (userId: string, courseId: string) => {
  const enrollments = cache.enrollments[userId] ?? [];
  if (!enrollments.includes(courseId)) {
    cache.enrollments[userId] = [...enrollments, courseId];
    persist(STORAGE_KEYS.enrollments, cache.enrollments);
  }
};

export const getCourseProgress = (userId: string, courseId: string): string[] => {
  return cache.progress[userId]?.[courseId] ?? [];
};

export const setCourseProgress = (userId: string, courseId: string, lessons: string[]) => {
  cache.progress[userId] = {
    ...(cache.progress[userId] ?? {}),
    [courseId]: lessons
  };
  persist(STORAGE_KEYS.progress, cache.progress);
};

export const getPayments = (): PaymentRecord[] => cache.payments;

export const setPayments = (payments: PaymentRecord[]) => {
  cache.payments = payments;
  persist(STORAGE_KEYS.payments, payments);
};

export const upsertPayment = (payment: PaymentRecord) => {
  const payments = [...cache.payments];
  const index = payments.findIndex(item => item.id === payment.id);
  if (index >= 0) {
    payments[index] = payment;
  } else {
    payments.push(payment);
  }
  setPayments(payments);
};

export const getCertificates = (): CertificateRecord[] => cache.certificates;

export const setCertificates = (certificates: CertificateRecord[]) => {
  cache.certificates = certificates;
  persist(STORAGE_KEYS.certificates, certificates);
};

export const upsertCertificate = (certificate: CertificateRecord) => {
  const certificates = [...cache.certificates];
  const index = certificates.findIndex(item => item.id === certificate.id);
  if (index >= 0) {
    certificates[index] = certificate;
  } else {
    certificates.push(certificate);
  }
  setCertificates(certificates);
};

export const getCertificateById = (certificateId: string) => {
  return cache.certificates.find(cert => cert.id === certificateId) ?? null;
};

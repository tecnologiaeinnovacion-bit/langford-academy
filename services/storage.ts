import { User } from '../types';

const STORAGE_KEYS = {
  user: 'langford_user',
  courses: 'langford_courses',
  enrollments: 'langford_enrollments',
  progress: 'langford_progress',
  certificates: 'langford_certificates',
  users: 'langford_users',
  certificateRecords: 'langford_certificate_records'
};

export const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Storage parse error:', error);
    return fallback;
  }
};

export const getStoredUser = (): User | null => {
  const stored = safeParse<Partial<User> | null>(localStorage.getItem(STORAGE_KEYS.user), null);
  if (!stored || !stored.name) return null;

  return {
    name: stored.name,
    email: stored.email ?? '',
    phone: stored.phone ?? '',
    country: stored.country ?? '',
    provider: stored.provider,
    password: stored.password,
    isLoggedIn: stored.isLoggedIn ?? true,
    id: stored.id
  };
};

export const setStoredUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem(STORAGE_KEYS.user);
};

export const getEnrollments = (): string[] => {
  return safeParse<string[]>(localStorage.getItem(STORAGE_KEYS.enrollments), []);
};

export const addEnrollment = (courseId: string): string[] => {
  const enrollments = getEnrollments();
  if (!enrollments.includes(courseId)) {
    enrollments.push(courseId);
    localStorage.setItem(STORAGE_KEYS.enrollments, JSON.stringify(enrollments));
  }
  return enrollments;
};

export const getCourseProgress = (courseId: string): string[] => {
  const progressMap = safeParse<Record<string, string[]>>(localStorage.getItem(STORAGE_KEYS.progress), {});
  return progressMap[courseId] ?? [];
};

export const setCourseProgress = (courseId: string, lessons: string[]) => {
  const progressMap = safeParse<Record<string, string[]>>(localStorage.getItem(STORAGE_KEYS.progress), {});
  progressMap[courseId] = lessons;
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progressMap));
};

export const getCertificateStatus = (courseId: string): boolean => {
  const statusMap = safeParse<Record<string, boolean>>(localStorage.getItem(STORAGE_KEYS.certificates), {});
  return Boolean(statusMap[courseId]);
};

export const setCertificateStatus = (courseId: string, value: boolean) => {
  const statusMap = safeParse<Record<string, boolean>>(localStorage.getItem(STORAGE_KEYS.certificates), {});
  statusMap[courseId] = value;
  localStorage.setItem(STORAGE_KEYS.certificates, JSON.stringify(statusMap));
};

export interface CertificateRecord {
  courseId: string;
  issuedAt: string;
  certificateId: string;
}

export const getCertificateRecord = (courseId: string): CertificateRecord | null => {
  const recordMap = safeParse<Record<string, CertificateRecord>>(localStorage.getItem(STORAGE_KEYS.certificateRecords), {});
  return recordMap[courseId] ?? null;
};

export const setCertificateRecord = (record: CertificateRecord) => {
  const recordMap = safeParse<Record<string, CertificateRecord>>(localStorage.getItem(STORAGE_KEYS.certificateRecords), {});
  recordMap[record.courseId] = record;
  localStorage.setItem(STORAGE_KEYS.certificateRecords, JSON.stringify(recordMap));
};

export const getStoredUsers = (): User[] => {
  return safeParse<User[]>(localStorage.getItem(STORAGE_KEYS.users), []);
};

export const setStoredUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
};

export const upsertUser = (user: User) => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(existing => existing.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  setStoredUsers(users);
};

export const findUserByEmail = (email: string): User | null => {
  const users = getStoredUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) ?? null;
};

export const getStoredCoursesRaw = () => {
  return localStorage.getItem(STORAGE_KEYS.courses);
};

export const setStoredCoursesRaw = (value: string) => {
  localStorage.setItem(STORAGE_KEYS.courses, value);
};

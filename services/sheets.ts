export const parseCsv = (raw: string): string[][] => {
  return raw
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(',').map((value) => value.trim()));
};

export const fetchSheetCsv = async (url: string): Promise<string[][]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo cargar la hoja.');
  }
  const text = await response.text();
  return parseCsv(text);
};

export type SheetCourseLesson = {
  courseId: string;
  courseTitle: string;
  instructor: string;
  instructorTitle: string;
  description: string;
  longDescription: string;
  category: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  price: number;
  certificatePrice: number;
  image: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonType: 'video' | 'reading' | 'link' | 'file' | 'quiz';
  lessonDuration: string;
  lessonUrl: string;
  lessonContent: string;
  lessonOptions: string[];
  lessonCorrectAnswer: number;
};

export const mapSheetCourses = (rows: string[][]): SheetCourseLesson[] => {
  const [header, ...data] = rows;
  if (!header) return [];
  const headerMap = new Map(header.map((value, index) => [value.toLowerCase(), index]));

  const getValue = (row: string[], key: string) => {
    const index = headerMap.get(key.toLowerCase());
    return index === undefined ? '' : row[index] ?? '';
  };

  return data
    .filter((row) => row.some((value) => value.trim() !== ''))
    .map((row) => ({
      courseId: getValue(row, 'course_id'),
      courseTitle: getValue(row, 'course_title'),
      instructor: getValue(row, 'instructor'),
      instructorTitle: getValue(row, 'instructor_title'),
      description: getValue(row, 'description'),
      longDescription: getValue(row, 'long_description'),
      category: getValue(row, 'category'),
      level: (getValue(row, 'level') as SheetCourseLesson['level']) || 'Principiante',
      price: Number(getValue(row, 'price')) || 0,
      certificatePrice: Number(getValue(row, 'certificate_price')) || 150000,
      image: getValue(row, 'image'),
      moduleId: getValue(row, 'module_id'),
      moduleTitle: getValue(row, 'module_title'),
      lessonId: getValue(row, 'lesson_id'),
      lessonTitle: getValue(row, 'lesson_title'),
      lessonType: (getValue(row, 'lesson_type') as SheetCourseLesson['lessonType']) || 'video',
      lessonDuration: getValue(row, 'lesson_duration'),
      lessonUrl: getValue(row, 'lesson_url'),
      lessonContent: getValue(row, 'lesson_content'),
      lessonOptions: getValue(row, 'lesson_options').split('|').map((value) => value.trim()).filter(Boolean),
      lessonCorrectAnswer: Number(getValue(row, 'lesson_correct_answer')) || 0
    }));
};

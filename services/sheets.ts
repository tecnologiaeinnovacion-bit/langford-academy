import { Course, Lesson, Module, ResourceType } from '../types';

const parseCsv = (content: string) => {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  const row: string[] = [];
  const pushCell = () => {
    row.push(current);
    current = '';
  };
  const pushRow = () => {
    rows.push([...row]);
    row.length = 0;
  };
  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }
    if (char === '\n' && !inQuotes) {
      pushCell();
      pushRow();
      continue;
    }
    if (char !== '\r') {
      current += char;
    }
  }
  if (current.length > 0 || row.length > 0) {
    pushCell();
    pushRow();
  }
  return rows;
};

const normalizeType = (value: string): ResourceType => {
  const normalized = value.toLowerCase().trim();
  if (['video', 'reading', 'link', 'file', 'quiz', 'task'].includes(normalized)) {
    return normalized as ResourceType;
  }
  return 'reading';
};

const buildLesson = (row: Record<string, string>, index: number): Lesson => {
  const type = normalizeType(row.lessonType);
  const base: Lesson = {
    id: row.lessonId || `lesson-${index}`,
    title: row.lessonTitle || 'Lección',
    duration: row.lessonDuration || '10:00',
    type,
    required: row.required !== 'false'
  };
  if (type === 'video') base.videoUrl = row.lessonUrl;
  if (type === 'reading') {
    base.externalLink = row.lessonUrl;
    base.content = row.lessonContent || '';
  }
  if (type === 'link') base.externalLink = row.lessonUrl;
  if (type === 'file') base.fileUrl = row.lessonUrl;
  if (type === 'task') base.taskPrompt = row.taskPrompt || 'Confirma tu aprendizaje.';
  if (type === 'quiz') {
    base.evaluation = [
      {
        id: row.quizId || `q-${index}`,
        question: row.quizQuestion || 'Pregunta',
        options: (row.quizOptions || '').split('|').filter(Boolean),
        correctAnswer: Number(row.quizAnswer || 0),
        explanation: row.quizExplanation || ''
      }
    ];
  }
  return base;
};

export const mapSheetToCourses = (csvContent: string): Course[] => {
  const rows = parseCsv(csvContent);
  if (rows.length <= 1) return [];
  const header = rows[0].map(value => value.trim());
  const records = rows.slice(1).map(row => {
    const record: Record<string, string> = {};
    header.forEach((key, idx) => {
      record[key] = row[idx] ?? '';
    });
    return record;
  });

  const courseMap = new Map<string, Course>();
  records.forEach((record, index) => {
    const courseId = record.courseId || `course-${index}`;
    const moduleId = record.moduleId || `module-${courseId}`;
    const lesson = buildLesson(record, index);

    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        id: courseId,
        title: record.courseTitle || 'Curso',
        instructor: record.instructor || 'Equipo Langford',
        instructorTitle: record.instructorTitle || 'Instructor',
        description: record.courseDescription || '',
        longDescription: record.courseLongDescription || record.courseDescription || '',
        rating: Number(record.rating || 4.9),
        reviewsCount: Number(record.reviewsCount || 0),
        studentsCount: Number(record.studentsCount || 0),
        duration: record.courseDuration || '3 meses',
        level: (record.level as Course['level']) || 'Intermedio',
        category: record.category || 'General',
        image: record.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        bannerImage: record.bannerImage || '',
        price: 0,
        certificatePrice: Number(record.certificatePrice || 150000),
        modules: [],
        tags: (record.tags || '').split('|').filter(Boolean)
      });
    }

    const course = courseMap.get(courseId);
    if (!course) return;
    let module = course.modules.find(item => item.id === moduleId);
    if (!module) {
      module = { id: moduleId, title: record.moduleTitle || 'Módulo', lessons: [] } as Module;
      course.modules.push(module);
    }
    module.lessons.push(lesson);
  });

  return Array.from(courseMap.values());
};

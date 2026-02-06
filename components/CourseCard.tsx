
import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, enrolled, progress }) => {
  return (
    <Link to={`/course/${course.id}`} className="flex flex-col h-full overflow-hidden transition-all duration-500 group">
      <div className="relative h-60 overflow-hidden rounded-t-3xl">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" />
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#d4af37]/30 px-3 py-1 text-[10px] font-black text-[#d4af37] rounded-full uppercase tracking-widest">
          {course.category}
        </div>
        {course.price === 0 && (
           <div className="absolute top-4 right-4 bg-[#d4af37] px-3 py-1 text-[10px] font-black text-black rounded-full uppercase tracking-widest shadow-lg">
           BECADO
         </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-grow bg-white/5 border-x border-b border-white/5 rounded-b-3xl">
        <h3 className="text-xl font-black text-white leading-tight mb-2 group-hover:text-[#d4af37] transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-6 font-medium italic">Con {course.instructor}</p>
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {course.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-gray-400 border border-white/10 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          {enrolled ? (
            <div className="w-full">
              <div className="flex justify-between text-[10px] font-black text-[#d4af37] uppercase mb-2">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#d4af37] h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[#d4af37] font-black text-lg">{course.rating.toFixed(1)}</span>
                <div className="flex text-[#d4af37] text-[10px] space-x-0.5">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{course.level}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

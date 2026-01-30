import { BookOpen } from "lucide-react";
import { Course } from "@/types/course";

interface CourseHeaderProps {
  course: Course;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{course.name}</h1>
              <p className="text-xs sm:text-sm text-gray-500">{course.code}</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-3 line-clamp-2 sm:line-clamp-none">{course.description}</p>
        </div>
      </div>
    </div>
  );
}

import { CourseCard } from './CourseCard'
import { Course } from '@/types/courses'
import { BookOpen } from 'lucide-react'

interface CoursesGridProps {
  courses: Course[]
  isLoading: boolean
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
}

export function CoursesGrid({ courses, isLoading, onEdit, onDelete }: CoursesGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No courses found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

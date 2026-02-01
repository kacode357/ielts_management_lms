import { BookOpen, Users, Calendar, Clock, Edit2, Trash2 } from 'lucide-react'
import { Course } from '@/types/courses'

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-700',
      ongoing: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{course.name}</h3>
          <p className="text-sm text-gray-500">{course.code}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(course.status)}`}>
          {course.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>{course.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{course.currentStudents} / {course.maxStudents} students</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{course.scheduleDesc}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Room:</span>
          <span>{course.room}</span>
        </div>
      </div>

      {typeof course.teacherId !== 'string' && course.teacherId && (
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
          <Users className="w-4 h-4 text-gray-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {course.teacherId.userId?.fullName || 'Teacher'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {course.teacherId.specialization}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(course)}
          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => onDelete(course._id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  )
}

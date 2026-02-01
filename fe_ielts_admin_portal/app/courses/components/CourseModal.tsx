import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Course } from '@/types/courses'
import { TeacherDropdown } from '@/types/teachers'
import { CourseLevelDropdown } from '@/types/course-levels'

interface FormData {
  name: string
  code: string
  description: string
  level: string
  teacherId: string
  startDate: string
  endDate: string
  totalHours: number
  room: string
  scheduleDesc: string
  maxStudents: number
}

interface CourseModalProps {
  isOpen: boolean
  editingCourse: Course | null
  formData: FormData
  errors: Record<string, string>
  teachers: TeacherDropdown[]
  levels: CourseLevelDropdown[]
  isLoading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export function CourseModal({
  isOpen,
  editingCourse,
  formData,
  errors,
  teachers,
  levels,
  isLoading,
  onClose,
  onSubmit,
  onChange,
}: CourseModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={onChange}
                name="name"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Enter course name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={onChange}
                name="code"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.code ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="e.g., IELTS-F-2024"
              />
              {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level *
              </label>
              <select
                value={formData.level}
                onChange={onChange}
                name="level"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.level ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select level</option>
                {levels.map((level) => (
                  <option key={level._id} value={level.code}>{level.name}</option>
                ))}
              </select>
              {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>
              <select
                value={formData.teacherId}
                onChange={onChange}
                name="teacherId"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.teacherId ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.code})
                  </option>
                ))}
              </select>
              {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={onChange}
                name="description"
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter course description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={onChange}
                name="startDate"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={onChange}
                name="endDate"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Hours *
              </label>
              <input
                type="number"
                value={formData.totalHours}
                onChange={onChange}
                name="totalHours"
                min="1"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.totalHours ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.totalHours && <p className="text-red-500 text-xs mt-1">{errors.totalHours}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Students *
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={onChange}
                name="maxStudents"
                min="1"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.maxStudents ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.maxStudents && <p className="text-red-500 text-xs mt-1">{errors.maxStudents}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room *
              </label>
              <input
                type="text"
                value={formData.room}
                onChange={onChange}
                name="room"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.room ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="e.g., Room A1"
              />
              {errors.room && <p className="text-red-500 text-xs mt-1">{errors.room}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule *
              </label>
              <input
                type="text"
                value={formData.scheduleDesc}
                onChange={onChange}
                name="scheduleDesc"
                className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.scheduleDesc ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="e.g., Mon-Wed-Fri 19:00-21:00"
              />
              {errors.scheduleDesc && <p className="text-red-500 text-xs mt-1">{errors.scheduleDesc}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingCourse ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout'
import {
  CoursesHeader,
  CoursesFilters,
  CoursesGrid,
  CoursesPagination,
  CourseModal,
} from './components'
import { useCourses, useTeachers, useCourseLevels, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/courses'
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

const initialFormData: FormData = {
  name: '',
  code: '',
  description: '',
  level: '',
  teacherId: '',
  startDate: '',
  endDate: '',
  totalHours: 0,
  room: '',
  scheduleDesc: '',
  maxStudents: 30,
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    page: 1,
    level: '',
    status: '',
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { courses, pagination, isLoading, fetchCourses } = useCourses(filters)
  const { teachers, fetchTeachers } = useTeachers()
  const { courseLevels, fetchCourseLevels } = useCourseLevels()
  const { createCourse, isLoading: isCreating } = useCreateCourse()
  const { updateCourse, isLoading: isUpdating } = useUpdateCourse()
  const { deleteCourse } = useDeleteCourse()

  useEffect(() => {
    fetchCourses()
    fetchTeachers()
    fetchCourseLevels()
  }, [filters, fetchCourses, fetchTeachers, fetchCourseLevels])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.code.trim()) newErrors.code = 'Code is required'
    if (!formData.level) newErrors.level = 'Level is required'
    if (!formData.teacherId) newErrors.teacherId = 'Teacher is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    if (Number(formData.totalHours) <= 0) newErrors.totalHours = 'Total hours must be greater than 0'
    if (!formData.room.trim()) newErrors.room = 'Room is required'
    if (!formData.scheduleDesc.trim()) newErrors.scheduleDesc = 'Schedule description is required'
    if (Number(formData.maxStudents) <= 0) newErrors.maxStudents = 'Max students must be greater than 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        name: course.name,
        code: course.code,
        description: course.description,
        level: course.level,
        teacherId: typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id,
        startDate: course.startDate.split('T')[0],
        endDate: course.endDate.split('T')[0],
        totalHours: course.totalHours,
        room: course.room,
        scheduleDesc: course.scheduleDesc,
        maxStudents: course.maxStudents,
      })
    } else {
      setEditingCourse(null)
      setFormData({
        ...initialFormData,
        startDate: new Date().toISOString().split('T')[0],
      })
    }
    setErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCourse(null)
    setFormData(initialFormData)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      let result

      if (editingCourse) {
        result = await updateCourse(editingCourse._id, formData)
      } else {
        result = await createCourse(formData)
      }

      if (result.success) {
        handleCloseModal()
        fetchCourses()
      }
    } catch (error) {
      console.error('Failed to save course:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id)
        fetchCourses()
      } catch (error) {
        console.error('Failed to delete course:', error)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['totalHours', 'maxStudents'].includes(name) ? parseInt(value) || 0 : value,
    }))
    if (errors[name]) {
      const newErrors = { ...errors }
      delete newErrors[name]
      setErrors(newErrors)
    }
  }

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CoursesHeader onAdd={() => handleOpenModal()} />

        <CoursesFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLevel={filters.level}
          onLevelChange={(value) => setFilters({ ...filters, level: value })}
          selectedStatus={filters.status}
          onStatusChange={(value) => setFilters({ ...filters, status: value })}
        />

        <CoursesGrid
          courses={filteredCourses}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />

        <CoursesPagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      </div>

      <CourseModal
        isOpen={isModalOpen}
        editingCourse={editingCourse}
        formData={formData}
        errors={errors}
        teachers={teachers}
        levels={courseLevels}
        isLoading={isCreating || isUpdating}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
      />
    </AdminLayout>
  )
}

import { Course } from './courses.type'
import { CourseFilters } from './courses.payload'

export interface CoursesResponse {
  success: boolean
  data: {
    courses: Course[]
    pagination: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

export interface CourseResponse {
  success: boolean
  data: {
    course: Course
  }
}

export interface CreateCourseResponse {
  success: boolean
  data: {
    course: Course
  }
  message?: string
}

export interface UpdateCourseResponse {
  success: boolean
  data: {
    course: Course
  }
  message?: string
}

export interface DeleteCourseResponse {
  success: boolean
  message: string
}

export interface AssignTeacherResponse {
  success: boolean
  message: string
}

export interface EnrollStudentsResponse {
  success: boolean
  message: string
}

export interface CourseMembersResponse {
  success: boolean
  data: {
    teacher: {
      _id: string
      teacherCode: string
      specialization: string
      experience: number
      rating: number
      userId: {
        _id: string
        fullName: string
        email: string
      }
    }
    students: Array<{
      _id: string
      enrollmentDate: string
      userId: {
        _id: string
        fullName: string
        email: string
        phone: string
      }
    }>
    pagination?: {
      total: number
      page: number
      limit: number
      pages: number
    }
  }
}

export interface TeachersResponse {
  success: boolean
  data: {
    teachers: Array<{
      _id: string
      teacherCode: string
      specialization: string
      experience: number
      rating: number
      userId: {
        _id: string
        fullName: string
        email: string
      }
    }>
  }
}

export interface ErrorResponse {
  success: boolean
  message: string
  error?: string
}

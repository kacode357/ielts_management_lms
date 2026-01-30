// ==================== STANDARD API RESPONSE TYPES ====================

// Standard API Success Response
export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
}

// Standard API Error Response (Single Error)
export interface ApiErrorResponse {
  success: false
  message: string
  errors: ApiFieldError[]
}

// API Field Error (for Multi Errors)
export interface ApiFieldError {
  message: string
  field: string
}

// Union type for any API response
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

// ==================== HTTP STATUS CODES ====================
export enum HttpStatus {
  Success = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
  NotImplemented = 501,
}

// ==================== AUTH TYPES ====================

export interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'teacher' | 'student'
  createdAt: string
  updatedAt: string
}

// Auth Payloads
export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
}

// Auth Data Responses (what comes in "data" field)
export interface LoginData {
  token: string
  user: User
}

export interface RegisterData {
  user: User
}

export interface AuthData {
  user: User
}

// ==================== STUDENT TYPES ====================

export interface Student {
  id: string
  fullName: string
  email: string
  phone?: string
  dateOfBirth?: string
  targetScore?: number
  currentLevel?: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'graduated'
  createdAt: string
  updatedAt: string
}

export interface CreateStudentPayload {
  fullName: string
  email: string
  phone?: string
  dateOfBirth?: string
  targetScore?: number
  currentLevel?: string
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {
  status?: 'active' | 'inactive' | 'graduated'
}

export interface StudentsResponse {
  success: boolean
  data: Student[]
  total: number
  message: string
}

export interface StudentResponse {
  success: boolean
  data: Student
  message: string
}

// ==================== TEACHER TYPES ====================

export interface Teacher {
  id: string
  fullName: string
  email: string
  phone?: string
  specialization?: string[]
  experience?: number
  rating?: number
  bio?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherPayload {
  fullName: string
  email: string
  phone?: string
  specialization?: string[]
  experience?: number
  bio?: string
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {
  status?: 'active' | 'inactive'
}

export interface TeachersResponse {
  success: boolean
  data: Teacher[]
  total: number
  message: string
}

export interface TeacherResponse {
  success: boolean
  data: Teacher
  message: string
}

// ==================== COURSE TYPES ====================

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  level: string
  duration: number // Duration in weeks
  totalHours?: number // Total teaching hours
  maxStudents?: number
  syllabus?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCoursePayload {
  name: string
  code: string
  description?: string
  level: string
  duration: number // Duration in weeks (required)
  totalHours?: number // Total teaching hours
  maxStudents?: number
  syllabus?: string
  isActive?: boolean
}

export interface UpdateCoursePayload extends Partial<CreateCoursePayload> {}

export interface CoursesResponse {
  success: boolean
  data: Course[]
  total: number
  message: string
}

export interface CourseResponse {
  success: boolean
  data: Course
  message: string
}

// ==================== CLASS TYPES ====================

export interface Class {
  id: string
  name: string
  courseId: string
  teacherId: string
  schedule: string
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  status: 'upcoming' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface CreateClassPayload {
  name: string
  courseId: string
  teacherId: string
  schedule: string
  startDate: string
  endDate: string
  maxStudents: number
}

export interface UpdateClassPayload extends Partial<CreateClassPayload> {
  status?: 'upcoming' | 'ongoing' | 'completed'
}

export interface ClassesResponse {
  success: boolean
  data: Class[]
  total: number
  message: string
}

export interface ClassResponse {
  success: boolean
  data: Class
  message: string
}

// ==================== MATERIAL TYPES ====================

export interface Material {
  id: string
  title: string
  description?: string
  type: 'pdf' | 'video' | 'audio' | 'document'
  url: string
  courseId: string
  createdAt: string
  updatedAt: string
}

export interface CreateMaterialPayload {
  title: string
  description?: string
  type: 'pdf' | 'video' | 'audio' | 'document'
  url: string
  courseId: string
}

export interface UpdateMaterialPayload extends Partial<CreateMaterialPayload> {}

export interface MaterialsResponse {
  success: boolean
  data: Material[]
  total: number
  message: string
}

export interface MaterialResponse {
  success: boolean
  data: Material
  message: string
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  totalClasses: number
  activeStudents: number
  completionRate: number
  monthlyGrowth: {
    students: number
    teachers: number
    courses: number
  }
}

export interface DashboardResponse {
  success: boolean
  data: DashboardStats
  message: string
}

// ==================== API ERROR TYPE ====================

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

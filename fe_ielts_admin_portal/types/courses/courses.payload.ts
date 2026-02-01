export interface CreateCoursePayload {
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

export interface UpdateCoursePayload {
  name?: string
  code?: string
  description?: string
  level?: string
  teacherId?: string
  startDate?: string
  endDate?: string
  totalHours?: number
  room?: string
  scheduleDesc?: string
  maxStudents?: number
  isActive?: boolean
}

export interface AssignTeacherPayload {
  teacherId: string
}

export interface EnrollStudentsPayload {
  studentIds: string[]
}

export interface CourseFilters {
  page?: number
  limit?: number
  status?: string
  level?: string
  isActive?: boolean
}

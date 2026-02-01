export interface TeacherUser {
  _id: string
  fullName: string
  email: string
}

export interface Teacher {
  _id: string
  teacherCode: string
  specialization: string
  experience?: number
  rating?: number
  userId?: TeacherUser
}

export interface Course {
  _id: string
  name: string
  code: string
  description: string
  level: string
  teacherId: Teacher | string
  startDate: string
  endDate: string
  totalHours: number
  room: string
  scheduleDesc: string
  currentStudents: number
  maxStudents: number
  status: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

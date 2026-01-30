export interface Teacher {
  _id: string;
  teacherCode: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: number;
  rating: number;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description: string;
  level: string;
  teacherId: Teacher;
  startDate: string;
  endDate: string;
  totalHours: number;
  room: string;
  scheduleDesc: string;
  currentStudents: number;
  maxStudents: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetCoursesResponse {
  success: boolean;
  data: {
    courses: Course[];
    pagination: Pagination;
  };
}

// Course Service
import { api } from "@/config/axios.config";

export interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  level: string;
  duration: number; // Duration in weeks
  totalHours?: number; // Total teaching hours
  maxStudents?: number;
  syllabus?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoursePayload {
  name: string;
  code: string;
  description?: string;
  level: string;
  duration: number; // Duration in weeks (required)
  totalHours?: number; // Total teaching hours
  maxStudents?: number;
  syllabus?: string;
  isActive?: boolean;
}

export interface Student {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  studentCode: string;
  currentLevel: string;
  targetBand: number;
}

export interface Teacher {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  teacherCode: string;
  specialization?: string;
  experience?: number;
}

export interface Enrollment {
  _id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  status: string;
}

export const courseService = {
  // Get all courses
  async getCourses() {
    return api.get<Course[]>("/courses");
  },

  // Get course by ID
  async getCourseById(id: string) {
    return api.get<Course>(`/courses/${id}`);
  },

  // Create new course
  async createCourse(data: CreateCoursePayload) {
    return api.post<Course>("/courses", data);
  },

  // Update course
  async updateCourse(id: string, data: Partial<CreateCoursePayload>) {
    return api.put<Course>(`/courses/${id}`, data);
  },

  // Delete course
  async deleteCourse(id: string) {
    return api.delete(`/courses/${id}`);
  },

  // Get all students
  async getStudents() {
    return api.get<Student[]>("/students");
  },

  // Get all teachers
  async getTeachers() {
    return api.get<Teacher[]>("/teachers");
  },

  // Enroll students in course
  async enrollStudents(courseId: string, studentIds: string[]) {
    return api.post<Enrollment[]>("/enrollments", {
      courseId,
      studentIds,
    });
  },

  // Get enrollments by course
  async getEnrollmentsByCourse(courseId: string) {
    return api.get<Enrollment[]>(
      `/enrollments?courseId=${courseId}`
    );
  },

  // Remove enrollment
  async removeEnrollment(enrollmentId: string) {
    return api.delete(`/enrollments/${enrollmentId}`);
  },
};

import axiosInstance from '@/config/axios.config';
import {
  CoursesResponse,
  CourseResponse,
  CreateCourseResponse,
  UpdateCourseResponse,
  DeleteCourseResponse,
  AssignTeacherResponse,
  EnrollStudentsResponse,
  CourseMembersResponse,
  TeachersResponse,
} from '@/types/courses';
import {
  CreateCoursePayload,
  UpdateCoursePayload,
  AssignTeacherPayload,
  EnrollStudentsPayload,
  CourseFilters,
} from '@/types/courses';

export const courseService = {
  getAll(filters?: CourseFilters): Promise<CoursesResponse> {
    return axiosInstance.get<CoursesResponse>('/courses', { params: filters }).then((res) => res.data);
  },

  getById(id: string): Promise<CourseResponse> {
    return axiosInstance.get<CourseResponse>(`/courses/${id}`).then((res) => res.data);
  },

  create(data: CreateCoursePayload): Promise<CreateCourseResponse> {
    return axiosInstance.post<CreateCourseResponse>('/courses', data).then((res) => res.data);
  },

  update(id: string, data: UpdateCoursePayload): Promise<UpdateCourseResponse> {
    return axiosInstance.put<UpdateCourseResponse>(`/courses/${id}`, data).then((res) => res.data);
  },

  delete(id: string): Promise<DeleteCourseResponse> {
    return axiosInstance.delete<DeleteCourseResponse>(`/courses/${id}`).then((res) => res.data);
  },

  assignTeacher(id: string, data: AssignTeacherPayload): Promise<AssignTeacherResponse> {
    return axiosInstance.put<AssignTeacherResponse>(`/courses/${id}/teacher`, data).then((res) => res.data);
  },

  enrollStudents(id: string, data: EnrollStudentsPayload): Promise<EnrollStudentsResponse> {
    return axiosInstance.post<EnrollStudentsResponse>(`/courses/${id}/enroll`, data).then((res) => res.data);
  },

  getMembers(id: string, page = 1, limit = 50): Promise<CourseMembersResponse> {
    return axiosInstance.get<CourseMembersResponse>(`/courses/${id}/members`, { params: { page, limit } }).then((res) => res.data);
  },

  getTeachers(): Promise<TeachersResponse> {
    return axiosInstance.get<TeachersResponse>('/teachers').then((res) => res.data);
  },
};

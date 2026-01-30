import api from './api';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth';

export const studentService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      ...payload,
      role: 'student'
    });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', {
      ...payload,
      role: 'student'
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getMyCourses: async () => {
    const response = await api.get('/students/my-courses');
    return response.data;
  },

  getMyClasses: async () => {
    const response = await api.get('/students/my-classes');
    return response.data;
  },

  getMyAssignments: async () => {
    const response = await api.get('/students/my-assignments');
    return response.data;
  },

  getMyAssessments: async () => {
    const response = await api.get('/students/my-assessments');
    return response.data;
  },

  submitAssignment: async (assignmentId: string, data: any) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, data);
    return response.data;
  },
};

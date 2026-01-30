import api from './api';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth';

export const teacherService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', {
      ...payload,
      role: 'teacher'
    });
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', {
      ...payload,
      role: 'teacher'
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
    const response = await api.get('/teachers/my-courses');
    return response.data;
  },

  getMyClasses: async () => {
    const response = await api.get('/teachers/my-classes');
    return response.data;
  },

  getMyStudents: async () => {
    const response = await api.get('/teachers/my-students');
    return response.data;
  },
};

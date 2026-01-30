import { api } from '@/config/axios.config';
import { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordPayload } from '@/types/auth';
import { LoginResponse, RegisterResponse, ForgotPasswordResponse, ResetPasswordResponse, ChangePasswordResponse } from '@/types/auth';
import { cookieUtils } from '@/utils/cookie';

/**
 * Student Authentication Service
 * Handles all student-specific authentication operations
 */
export const studentService = {
  /**
   * Student Login
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      ...payload,
      role: 'student'
    });
    
    // Store token and user in cookies
    if (response.token) {
      cookieUtils.set('token', response.token, 7);
    }
    if (response.user) {
      cookieUtils.setJSON('user', response.user, 7);
    }
    
    return response;
  },

  /**
   * Student Register
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', {
      ...payload,
      role: 'student'
    });
  },

  /**
   * Student Forgot Password
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', payload);
  },

  /**
   * Student Reset Password
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', payload);
  },

  /**
   * Student Change Password
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>('/auth/change-password', payload);
  },

  /**
   * Student Logout
   */
  logout: async (): Promise<void> => {
    await api.post<void>('/auth/logout');
    cookieUtils.remove('token');
    cookieUtils.remove('user');
  },

  /**
   * Get Current Student Profile
   */
  getProfile: async () => {
    return api.get('/auth/me');
  },

  /**
   * Confirm Student Email
   */
  confirmEmail: async (token: string) => {
    return api.get(`/auth/confirm-email/${token}`);
  },

  /**
   * Get Student's Enrolled Courses
   */
  getMyCourses: async () => {
    return api.get('/students/my-courses');
  },

  /**
   * Get Student's Classes
   */
  getMyClasses: async () => {
    return api.get('/students/my-classes');
  },

  /**
   * Get Student's Assignments
   */
  getMyAssignments: async () => {
    return api.get('/students/my-assignments');
  },

  /**
   * Get Student's Assessments
   */
  getMyAssessments: async () => {
    return api.get('/students/my-assessments');
  },
};

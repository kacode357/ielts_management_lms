import { api } from '@/config/axios.config';
import { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordPayload } from '@/types/auth';
import { LoginResponse, RegisterResponse, ForgotPasswordResponse, ResetPasswordResponse, ChangePasswordResponse } from '@/types/auth';
import { cookieUtils } from '@/utils/cookie';

/**
 * Teacher Authentication Service
 * Handles all teacher-specific authentication operations
 */
export const teacherService = {
  /**
   * Teacher Login
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      ...payload,
      role: 'teacher'
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
   * Teacher Register
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', {
      ...payload,
      role: 'teacher'
    });
  },

  /**
   * Teacher Forgot Password
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', payload);
  },

  /**
   * Teacher Reset Password
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', payload);
  },

  /**
   * Teacher Change Password
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>('/auth/change-password', payload);
  },

  /**
   * Teacher Logout
   */
  logout: async (): Promise<void> => {
    await api.post<void>('/auth/logout');
    cookieUtils.remove('token');
    cookieUtils.remove('user');
  },

  /**
   * Get Current Teacher Profile
   */
  getProfile: async () => {
    return api.get('/auth/me');
  },

  /**
   * Confirm Teacher Email
   */
  confirmEmail: async (token: string) => {
    return api.get(`/auth/confirm-email/${token}`);
  },

  /**
   * Get Teacher's Courses
   */
  getMyCourses: async () => {
    return api.get('/teachers/my-courses');
  },

  /**
   * Get Teacher's Classes
   */
  getMyClasses: async () => {
    return api.get('/teachers/my-classes');
  },
};

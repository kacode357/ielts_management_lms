import { api } from '@/config/axios.config';
import { LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordPayload } from '@/types/auth';
import { LoginResponse, RegisterResponse, ForgotPasswordResponse, ResetPasswordResponse, ChangePasswordResponse } from '@/types/auth';
import { cookieUtils } from '@/utils/cookie';

/**
 * Admin Authentication Service
 * Handles all admin-specific authentication operations
 */
export const adminService = {
  /**
   * Admin Login
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      ...payload,
      role: 'admin'
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
   * Admin Register (typically restricted)
   */
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/auth/register', {
      ...payload,
      role: 'admin'
    });
  },

  /**
   * Admin Forgot Password
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', payload);
  },

  /**
   * Admin Reset Password
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', payload);
  },

  /**
   * Admin Change Password
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>('/auth/change-password', payload);
  },

  /**
   * Admin Logout
   */
  logout: async (): Promise<void> => {
    await api.post<void>('/auth/logout');
    cookieUtils.remove('token');
    cookieUtils.remove('user');
  },

  /**
   * Get Current Admin Profile
   */
  getProfile: async () => {
    return api.get('/auth/me');
  },

  /**
   * Confirm Admin Email
   */
  confirmEmail: async (token: string) => {
    return api.get(`/auth/confirm-email/${token}`);
  },
};

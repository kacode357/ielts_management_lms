import { api } from '@/config/axios.config'
import { cookieUtils } from '@/utils/cookie'
import { 
  LoginPayload, 
  RegisterPayload,
  LoginData,
  RegisterData,
  AuthData,
  User,
} from '@/types/api.types'
import { 
  ChangePasswordPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ConfirmEmailPayload,
  GoogleLoginPayload,
} from '@/types/auth'

export const authService = {
  // Login
  login: async (payload: LoginPayload): Promise<LoginData> => {
    const response = await api.post<LoginData>('/auth/login', payload)
    
    // Store token and user data in cookies
    if (response.token) {
      cookieUtils.set('token', response.token, 7)
    }
    
    if (response.user) {
      cookieUtils.setJSON('user', response.user, 7)
    }
    
    return response
  },

  // Register
  register: async (payload: RegisterPayload): Promise<RegisterData> => {
    const response = await api.post<RegisterData>('/auth/register', payload)
    return response
  },

  // Logout
  logout: () => {
    cookieUtils.remove('token')
    cookieUtils.remove('user')
  },

  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<AuthData>('/auth/profile')
    
    // Update stored user data in cookies
    if (response.user) {
      cookieUtils.setJSON('user', response.user, 7)
    }
    
    return response.user
  },

  // Change password
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await api.post('/auth/change-password', payload)
  },

  // Forgot password
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await api.post('/auth/forgot-password', payload)
  },

  // Reset password
  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await api.post('/auth/reset-password', payload)
  },

  // Confirm email
  confirmEmail: async (payload: ConfirmEmailPayload): Promise<void> => {
    await api.post('/auth/confirm-email', payload)
  },

  // Google login
  googleLogin: async (payload: GoogleLoginPayload): Promise<LoginData> => {
    const response = await api.post<LoginData>('/auth/google', payload)
    
    // Store token and user data in cookies
    if (response.token) {
      cookieUtils.set('token', response.token, 7)
    }
    
    if (response.user) {
      cookieUtils.setJSON('user', response.user, 7)
    }
    
    return response
  },

  // Helper methods
  getStoredUser: (): User | null => {
    return cookieUtils.getJSON<User>('user')
  },

  getStoredToken: (): string | null => {
    return cookieUtils.get('token')
  },

  isAuthenticated: (): boolean => {
    return !!cookieUtils.get('token')
  },
}

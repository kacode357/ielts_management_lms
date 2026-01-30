// Auth Response Types

export interface User {
  id: string
  email: string
  fullName?: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'teacher' | 'student'
  phone?: string
  isActive?: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User
  message: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

export interface AuthResponse {
  success: boolean
  user: User
  message: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface ConfirmEmailResponse {
  success: boolean
  message: string
}

export interface GoogleLoginResponse {
  success: boolean
  token: string
  user: User
  message: string
}

// Auth Payload Types

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher'
  phone?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ConfirmEmailPayload {
  token: string
}

export interface GoogleLoginPayload {
  token: string
}

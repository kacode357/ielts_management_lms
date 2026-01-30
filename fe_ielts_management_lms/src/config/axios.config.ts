import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { cookieUtils } from '@/utils/cookie'
import toast from 'react-hot-toast'
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/api.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// ==================== REQUEST INTERCEPTOR ====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add token to request headers if available
    const token = cookieUtils.get('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// ==================== RESPONSE INTERCEPTOR ====================
apiClient.interceptors.response.use(
  // Success response handler
  (response) => {
    // Return data directly - all responses should follow ApiSuccessResponse format
    return response
  },
  
  // Error response handler - GLOBAL ERROR HANDLING
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject({
        success: false,
        message: 'Network error. Please check your connection.',
        errors: []
      })
    }

    const { status, data } = error.response

    // Handle different HTTP status codes
    switch (status) {
      case 400: // Bad Request
        if (data?.errors && data.errors.length > 0) {
          // Multi-field errors
          data.errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`)
          })
        } else if (data?.message) {
          // Single error message
          toast.error(data.message)
        } else {
          toast.error('Invalid request. Please check your input.')
        }
        break

      case 401: // Unauthorized
        const errorMessage = data?.message || 'Unauthorized. Please login again.'
        toast.error(errorMessage)
        
        // Only clear auth and redirect if user has a token (token expired/invalid)
        // If no token exists, user is already on login page - don't redirect
        const hasToken = cookieUtils.get('token')
        if (hasToken) {
          // Clear auth data
          cookieUtils.remove('token')
          cookieUtils.remove('user')
          
          // Only redirect if not already on login/auth pages
          const currentPath = window.location.pathname
          if (!currentPath.startsWith('/auth')) {
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 1000)
          }
        }
        break

      case 403: // Forbidden
        toast.error(data?.message || 'You do not have permission to perform this action.')
        break

      case 404: // Not Found
        toast.error(data?.message || 'Resource not found.')
        break

      case 409: // Conflict
        toast.error(data?.message || 'Resource already exists.')
        break

      case 422: // Unprocessable Entity (Validation Error)
        if (data?.errors && data.errors.length > 0) {
          data.errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`)
          })
        } else if (data?.message) {
          toast.error(data.message)
        }
        break

      case 500: // Internal Server Error
        toast.error(data?.message || 'Internal server error. Please try again later.')
        break

      case 501: // Not Implemented
        toast.error(data?.message || 'This feature is not yet implemented.')
        break

      case 503: // Service Unavailable
        toast.error('Service temporarily unavailable. Please try again later.')
        break

      default:
        // Generic error for other status codes
        toast.error(data?.message || 'An unexpected error occurred.')
    }

    // Return standardized error response
    return Promise.reject(data || {
      success: false,
      message: 'An unexpected error occurred.',
      errors: []
    })
  }
)

// ==================== TYPED API WRAPPER ====================
// Helper function to ensure type safety with standard API response
// Backend returns: { success: true, data: T }
// This wrapper unwraps to return just T
export const api = {
  get: <T>(url: string, config?: any) => 
    apiClient.get<ApiSuccessResponse<T>>(url, config).then(res => res.data.data),
  
  post: <T>(url: string, data?: any, config?: any) => 
    apiClient.post<ApiSuccessResponse<T>>(url, data, config).then(res => res.data.data),
  
  put: <T>(url: string, data?: any, config?: any) => 
    apiClient.put<ApiSuccessResponse<T>>(url, data, config).then(res => res.data.data),
  
  patch: <T>(url: string, data?: any, config?: any) => 
    apiClient.patch<ApiSuccessResponse<T>>(url, data, config).then(res => res.data.data),
  
  delete: <T>(url: string, config?: any) => 
    apiClient.delete<ApiSuccessResponse<T>>(url, config).then(res => res.data.data),
}

export default apiClient

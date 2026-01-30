import { useState } from 'react'
import { authService } from '@/services/auth.service'
import { ForgotPasswordPayload } from '@/types/auth'
import toast from 'react-hot-toast'

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const forgotPassword = async (payload: ForgotPasswordPayload) => {
    setIsLoading(true)
    
    try {
      await authService.forgotPassword(payload)
      toast.success('Password reset email sent! Please check your inbox.')
    } finally {
      setIsLoading(false)
    }
  }

  return { forgotPassword, isLoading }
}

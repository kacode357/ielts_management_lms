import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { ResetPasswordPayload } from '@/types/auth'
import toast from 'react-hot-toast'

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const resetPassword = async (payload: ResetPasswordPayload) => {
    setIsLoading(true)
    
    try {
      await authService.resetPassword(payload)
      toast.success('Password reset successfully! Please login.')
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPassword, isLoading }
}

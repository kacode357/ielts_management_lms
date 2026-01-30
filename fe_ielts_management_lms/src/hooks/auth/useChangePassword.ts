import { useState } from 'react'
import { authService } from '@/services/auth.service'
import { ChangePasswordPayload } from '@/types/auth'
import toast from 'react-hot-toast'

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false)

  const changePassword = async (payload: ChangePasswordPayload) => {
    setIsLoading(true)
    
    try {
      await authService.changePassword(payload)
      toast.success('Password changed successfully!')
    } finally {
      setIsLoading(false)
    }
  }

  return { changePassword, isLoading }
}

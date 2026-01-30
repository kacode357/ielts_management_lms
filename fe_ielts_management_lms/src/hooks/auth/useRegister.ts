import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { RegisterPayload } from '@/types/api.types'
import toast from 'react-hot-toast'

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true)
    
    try {
      const data = await authService.register(payload)
      
      // Show success toast
      toast.success('Registration successful! Please login.')
      
      // Redirect to login page
      router.push('/auth/login')
      
      return data
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading }
}

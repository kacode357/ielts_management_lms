import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { LoginPayload } from '@/types/api.types'
import toast from 'react-hot-toast'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = async (payload: LoginPayload) => {
    setIsLoading(true)
    
    try {
      const data = await authService.login(payload)
      
      // Show success toast
      toast.success('Login successful! Redirecting...')
      
      // Redirect to dashboard after successful login
      router.push('/dashboard')
      
      return data
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}

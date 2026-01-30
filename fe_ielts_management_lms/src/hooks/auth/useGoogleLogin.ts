import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { GoogleLoginPayload } from '@/types/auth'
import toast from 'react-hot-toast'

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const googleLogin = async (payload: GoogleLoginPayload) => {
    setIsLoading(true)
    
    try {
      const data = await authService.googleLogin(payload)
      
      // Show success toast
      toast.success('Google login successful! Redirecting...')
      
      // Redirect to dashboard
      router.push('/dashboard')
      
      return data
    } finally {
      setIsLoading(false)
    }
  }

  return { googleLogin, isLoading }
}

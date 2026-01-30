import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { ConfirmEmailPayload } from '@/types/auth'
import toast from 'react-hot-toast'

export const useConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const confirmEmail = async (payload: ConfirmEmailPayload) => {
    setIsLoading(true)
    
    try {
      await authService.confirmEmail(payload)
      toast.success('Email confirmed successfully! Please login.')
      router.push('/auth/login')
    } finally {
      setIsLoading(false)
    }
  }

  return { confirmEmail, isLoading }
}

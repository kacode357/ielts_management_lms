import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

export const useLogout = () => {
  const router = useRouter()

  const logout = () => {
    authService.logout()
    router.push('/auth/login')
  }

  return { logout }
}

import { useState } from 'react'
import { courseService } from '@/services/courses'

export const useDeleteCourse = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteCourse = async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await courseService.delete(id)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete course')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteCourse, isLoading, error }
}

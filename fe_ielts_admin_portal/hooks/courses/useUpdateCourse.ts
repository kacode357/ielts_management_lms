import { useState } from 'react'
import { courseService } from '@/services/courses'
import { UpdateCoursePayload } from '@/types/courses'

export const useUpdateCourse = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateCourse = async (id: string, data: UpdateCoursePayload) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await courseService.update(id, data)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update course')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { updateCourse, isLoading, error }
}

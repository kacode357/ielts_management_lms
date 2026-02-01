import { useState } from 'react'
import { courseService } from '@/services/courses'
import { CreateCoursePayload } from '@/types/courses'

export const useCreateCourse = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createCourse = async (data: CreateCoursePayload) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await courseService.create(data)
      return response
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create course')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { createCourse, isLoading, error }
}

import { useCallback, useState } from 'react'
import { courseService } from '@/services/courses'

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCourse = useCallback(async () => {
    if (!id) return
    try {
      setIsLoading(true)
      setError(null)
      const response = await courseService.getById(id)
      if (response.success) {
        setCourse(response.data.course)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch course'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  return { course, isLoading, error, fetchCourse }
}

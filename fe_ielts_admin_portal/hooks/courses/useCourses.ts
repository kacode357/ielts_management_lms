import { useCallback, useState } from 'react'
import { courseService } from '@/services/courses'
import { CourseFilters } from '@/types/courses'

export const useCourses = (filters?: CourseFilters) => {
  const [courses, setCourses] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await courseService.getAll(filters)
      if (response.success) {
        setCourses(response.data.courses)
        setPagination(response.data.pagination)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch courses'))
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  return { courses, pagination, isLoading, error, fetchCourses }
}

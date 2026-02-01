"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { CourseLevel, CourseLevelResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseCourseLevelReturn {
  courseLevel: CourseLevel | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (id: string) => Promise<void>;
}

export const useCourseLevel = (): UseCourseLevelReturn => {
  const [courseLevel, setCourseLevel] = useState<CourseLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourseLevel = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: CourseLevelResponse = await courseLevelsService.getById(id);
      
      if (response.success) {
        setCourseLevel(response.data);
      } else {
        throw new Error('Course level not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course level';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    courseLevel,
    isLoading,
    error,
    refetch: fetchCourseLevel,
  };
};

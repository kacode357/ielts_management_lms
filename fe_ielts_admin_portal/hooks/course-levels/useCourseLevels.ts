"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { CourseLevel, CourseLevelsResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseCourseLevelsOptions {
  includeInactive?: boolean;
}

interface UseCourseLevelsReturn {
  courseLevels: CourseLevel[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useCourseLevels = (options: UseCourseLevelsOptions = {}): UseCourseLevelsReturn => {
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourseLevels = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: CourseLevelsResponse = await courseLevelsService.getAll(options.includeInactive);
      
      if (response.success) {
        setCourseLevels(response.data);
      } else {
        throw new Error('Failed to fetch course levels');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch course levels';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options.includeInactive]);

  return {
    courseLevels,
    isLoading,
    error,
    refetch: fetchCourseLevels,
  };
};

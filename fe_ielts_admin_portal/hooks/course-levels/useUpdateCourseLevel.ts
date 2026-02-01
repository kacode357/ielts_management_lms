"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { UpdateCourseLevelPayload, CourseLevel, UpdateCourseLevelResponse, ErrorResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseUpdateCourseLevelReturn {
  updateCourseLevel: (id: string, data: UpdateCourseLevelPayload) => Promise<{ success: boolean; data?: CourseLevel; error?: Error }>;
  isLoading: boolean;
  error: Error | null;
}

export const useUpdateCourseLevel = (): UseUpdateCourseLevelReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCourseLevel = useCallback(async (id: string, data: UpdateCourseLevelPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseLevelsService.update(id, data) as UpdateCourseLevelResponse | ErrorResponse;
      
      if (response.success) {
        toast.success('Course level updated successfully!');
        return { success: true, data: (response as UpdateCourseLevelResponse).data };
      } else {
        const errorResponse = response as ErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to update course level';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update course level';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateCourseLevel,
    isLoading,
    error,
  };
};

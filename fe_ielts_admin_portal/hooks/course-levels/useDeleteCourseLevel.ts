"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { DeleteCourseLevelResponse, ErrorResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseDeleteCourseLevelReturn {
  deleteCourseLevel: (id: string) => Promise<{ success: boolean; error?: Error }>;
  isLoading: boolean;
  error: Error | null;
}

export const useDeleteCourseLevel = (): UseDeleteCourseLevelReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCourseLevel = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseLevelsService.delete(id) as DeleteCourseLevelResponse | ErrorResponse;
      
      if (response.success) {
        toast.success('Course level deleted successfully!');
        return { success: true };
      } else {
        const errorResponse = response as ErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to delete course level';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete course level';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteCourseLevel,
    isLoading,
    error,
  };
};

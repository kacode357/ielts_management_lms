"use client";

import { useState, useCallback } from 'react';
import { courseLevelsService } from '@/services/course-levels';
import { ReorderCourseLevelsPayload, ReorderCourseLevelsResponse, ErrorResponse } from '@/types/course-levels';
import { toast } from 'react-hot-toast';

interface UseReorderCourseLevelsReturn {
  reorderCourseLevels: (data: ReorderCourseLevelsPayload) => Promise<{ success: boolean; error?: Error }>;
  isLoading: boolean;
  error: Error | null;
}

export const useReorderCourseLevels = (): UseReorderCourseLevelsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reorderCourseLevels = useCallback(async (data: ReorderCourseLevelsPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await courseLevelsService.reorder(data) as ReorderCourseLevelsResponse | ErrorResponse;
      
      if (response.success) {
        toast.success('Course levels reordered successfully!');
        return { success: true };
      } else {
        const errorResponse = response as ErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to reorder course levels';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder course levels';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    reorderCourseLevels,
    isLoading,
    error,
  };
};

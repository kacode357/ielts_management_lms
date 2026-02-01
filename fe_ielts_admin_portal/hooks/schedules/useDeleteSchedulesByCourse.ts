"use client";

import { useState, useCallback } from 'react';
import { schedulesService } from '@/services/schedules';
import { DeleteSchedulesByCourseResponse, ScheduleErrorResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseDeleteSchedulesByCourseReturn {
  deleteSchedulesByCourse: (courseId: string) => Promise<{
    success: boolean;
    deletedCount?: number;
    error?: Error;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export const useDeleteSchedulesByCourse = (): UseDeleteSchedulesByCourseReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteSchedulesByCourse = useCallback(async (courseId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await schedulesService.deleteByCourse(courseId) as DeleteSchedulesByCourseResponse | ScheduleErrorResponse;
      if (response.success) {
        const successResponse = response as DeleteSchedulesByCourseResponse;
        toast.success(`Deleted ${successResponse.data.deletedCount} schedules successfully!`);
        return { success: true, deletedCount: successResponse.data.deletedCount };
      } else {
        const errorResponse = response as ScheduleErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to delete schedules';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedules';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteSchedulesByCourse,
    isLoading,
    error,
  };
};

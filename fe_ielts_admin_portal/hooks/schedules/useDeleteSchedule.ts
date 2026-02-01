"use client";

import { useState, useCallback } from 'react';
import { schedulesService } from '@/services/schedules';
import { DeleteScheduleResponse, ScheduleErrorResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseDeleteScheduleReturn {
  deleteSchedule: (id: string) => Promise<{
    success: boolean;
    error?: Error;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export const useDeleteSchedule = (): UseDeleteScheduleReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteSchedule = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await schedulesService.delete(id) as DeleteScheduleResponse | ScheduleErrorResponse;
      if (response.success) {
        toast.success('Schedule deleted successfully!');
        return { success: true };
      } else {
        const errorResponse = response as ScheduleErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to delete schedule';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteSchedule,
    isLoading,
    error,
  };
};

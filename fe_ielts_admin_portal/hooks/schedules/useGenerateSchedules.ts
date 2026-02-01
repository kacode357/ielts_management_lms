"use client";

import { useState, useCallback } from 'react';
import { schedulesService } from '@/services/schedules';
import { GenerateSchedulesPayload, GenerateSchedulesResponse, ScheduleErrorResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseGenerateSchedulesReturn {
  generateSchedules: (data: GenerateSchedulesPayload) => Promise<{
    success: boolean;
    total?: number;
    error?: Error;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export const useGenerateSchedules = (): UseGenerateSchedulesReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateSchedules = useCallback(async (data: GenerateSchedulesPayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await schedulesService.generate(data) as GenerateSchedulesResponse | ScheduleErrorResponse;
      if (response.success) {
        const successResponse = response as GenerateSchedulesResponse;
        toast.success(`Generated ${successResponse.data.total} schedules successfully!`);
        return { success: true, total: successResponse.data.total };
      } else {
        const errorResponse = response as ScheduleErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to generate schedules';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate schedules';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateSchedules,
    isLoading,
    error,
  };
};

"use client";

import { useState, useCallback } from 'react';
import { schedulesService } from '@/services/schedules';
import { UpdateSchedulePayload, UpdateScheduleResponse, ScheduleErrorResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseUpdateScheduleReturn {
  updateSchedule: (id: string, data: UpdateSchedulePayload) => Promise<{
    success: boolean;
    error?: Error;
  }>;
  isLoading: boolean;
  error: Error | null;
}

export const useUpdateSchedule = (): UseUpdateScheduleReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSchedule = useCallback(async (id: string, data: UpdateSchedulePayload) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await schedulesService.update(id, data) as UpdateScheduleResponse | ScheduleErrorResponse;
      if (response.success) {
        toast.success('Schedule updated successfully!');
        return { success: true };
      } else {
        const errorResponse = response as ScheduleErrorResponse;
        const errorMsg = errorResponse.message || 'Failed to update schedule';
        toast.error(errorMsg);
        setError(new Error(errorMsg));
        return { success: false, error: new Error(errorMsg) };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      return { success: false, error: err instanceof Error ? err : new Error(errorMessage) };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateSchedule,
    isLoading,
    error,
  };
};

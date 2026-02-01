"use client";

import { useState, useCallback } from 'react';
import { schedulesService } from '@/services/schedules';
import { Schedule, ScheduleResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseScheduleReturn {
  schedule: Schedule | null;
  isLoading: boolean;
  error: Error | null;
  refetch: (id: string) => Promise<void>;
}

export const useSchedule = (): UseScheduleReturn => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedule = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: ScheduleResponse = await schedulesService.getById(id);
      if (response.success) {
        setSchedule(response.data);
      } else {
        throw new Error('Schedule not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schedule';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    schedule,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
};

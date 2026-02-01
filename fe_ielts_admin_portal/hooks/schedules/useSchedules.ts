"use client";

import { useState, useCallback, useEffect } from 'react';
import { schedulesService } from '@/services/schedules';
import { Schedule, ScheduleFilters, SchedulesResponse } from '@/types/schedules';
import { toast } from 'react-hot-toast';

interface UseSchedulesReturn {
  schedules: Schedule[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  isLoading: boolean;
  error: Error | null;
  refetch: (filters?: ScheduleFilters) => Promise<void>;
}

export const useSchedules = (filters?: ScheduleFilters): UseSchedulesReturn => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSchedules = useCallback(async (filterParams?: ScheduleFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: SchedulesResponse = await schedulesService.getAll(filterParams || filters);
      if (response.success) {
        setSchedules(response.data.schedules);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Failed to fetch schedules');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch schedules';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    pagination,
    isLoading,
    error,
    refetch: fetchSchedules,
  };
};

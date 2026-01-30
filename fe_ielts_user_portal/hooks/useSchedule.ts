"use client";

import { useState } from 'react';
import { scheduleService } from '@/services/schedule';
import { GetSchedulePayload, Schedule } from '@/types/schedule';
import { toast } from 'react-hot-toast';

export const useSchedule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [total, setTotal] = useState(0);

  const getMySchedule = async (params?: GetSchedulePayload) => {
    try {
      setIsLoading(true);
      const response = await scheduleService.getMySchedule(params);

      if (response.success) {
        setSchedules(response.data.schedules);
        setTotal(response.data.total);
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Get schedule error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch schedule';
      toast.error(errorMessage);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMySchedule,
    isLoading,
    schedules,
    total,
  };
};

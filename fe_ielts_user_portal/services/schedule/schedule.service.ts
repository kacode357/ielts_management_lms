import axiosInstance from '@/config/axios.config';
import { GetSchedulePayload, GetScheduleResponse } from '@/types/schedule';

export const scheduleService = {
  getMySchedule: async (params?: GetSchedulePayload): Promise<GetScheduleResponse> => {
    const response = await axiosInstance.get<GetScheduleResponse>('/schedules/teacher/my-schedule', {
      params,
    });
    return response.data;
  },
};

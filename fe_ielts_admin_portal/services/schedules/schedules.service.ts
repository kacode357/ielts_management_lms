import axiosInstance from '@/config/axios.config';
import {
  SchedulesResponse,
  ScheduleResponse,
  GenerateSchedulesResponse,
  UpdateScheduleResponse,
  DeleteScheduleResponse,
  DeleteSchedulesByCourseResponse,
} from '@/types/schedules';
import {
  ScheduleFilters,
  GenerateSchedulesPayload,
  UpdateSchedulePayload,
} from '@/types/schedules';

export const schedulesService = {
  getAll: (filters?: ScheduleFilters): Promise<SchedulesResponse> => {
    return axiosInstance.get<SchedulesResponse>('/schedules', { params: filters }).then((res) => res.data);
  },

  getById: (id: string): Promise<ScheduleResponse> => {
    return axiosInstance.get<ScheduleResponse>(`/schedules/${id}`).then((res) => res.data);
  },

  generate: (data: GenerateSchedulesPayload): Promise<GenerateSchedulesResponse> => {
    return axiosInstance.post<GenerateSchedulesResponse>('/schedules/generate', data).then((res) => res.data);
  },

  update: (id: string, data: UpdateSchedulePayload): Promise<UpdateScheduleResponse> => {
    return axiosInstance.put<UpdateScheduleResponse>(`/schedules/${id}`, data).then((res) => res.data);
  },

  delete: (id: string): Promise<DeleteScheduleResponse> => {
    return axiosInstance.delete<DeleteScheduleResponse>(`/schedules/${id}`).then((res) => res.data);
  },

  deleteByCourse: (courseId: string): Promise<DeleteSchedulesByCourseResponse> => {
    return axiosInstance.delete<DeleteSchedulesByCourseResponse>(`/schedules/course/${courseId}`).then((res) => res.data);
  },
};

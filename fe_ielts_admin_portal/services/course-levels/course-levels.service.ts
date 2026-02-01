import axiosInstance from '@/config/axios.config';
import {
  CourseLevelDropdown,
  CourseLevelsDropdownResponse,
  CourseLevelsResponse,
  CourseLevelResponse,
  CreateCourseLevelResponse,
  UpdateCourseLevelResponse,
  DeleteCourseLevelResponse,
  ReorderCourseLevelsResponse,
} from '@/types/course-levels';
import {
  CreateCourseLevelPayload,
  UpdateCourseLevelPayload,
  ReorderCourseLevelsPayload,
} from '@/types/course-levels';

export const courseLevelsService = {
  getDropdown: async (): Promise<CourseLevelDropdown[]> => {
    const response = await axiosInstance.get<CourseLevelsDropdownResponse>('/course-levels/dropdown');
    return response.data.data;
  },

  getAll: async (includeInactive?: boolean): Promise<CourseLevelsResponse> => {
    const response = await axiosInstance.get<CourseLevelsResponse>('/course-levels', {
      params: { includeInactive },
    });
    return response.data;
  },

  getById: async (id: string): Promise<CourseLevelResponse> => {
    const response = await axiosInstance.get<CourseLevelResponse>(`/course-levels/${id}`);
    return response.data;
  },

  create: async (data: CreateCourseLevelPayload): Promise<CreateCourseLevelResponse> => {
    const response = await axiosInstance.post<CreateCourseLevelResponse>('/course-levels', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCourseLevelPayload): Promise<UpdateCourseLevelResponse> => {
    const response = await axiosInstance.put<UpdateCourseLevelResponse>(`/course-levels/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<DeleteCourseLevelResponse> => {
    const response = await axiosInstance.delete<DeleteCourseLevelResponse>(`/course-levels/${id}`);
    return response.data;
  },

  reorder: async (data: ReorderCourseLevelsPayload): Promise<ReorderCourseLevelsResponse> => {
    const response = await axiosInstance.put<ReorderCourseLevelsResponse>('/course-levels/reorder', data);
    return response.data;
  },
};

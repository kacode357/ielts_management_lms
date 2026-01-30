import axiosInstance from '@/config/axios.config';
import { GetCoursesPayload, GetCoursesResponse, GetMembersPayload, GetMembersResponse } from '@/types/course';

export const courseService = {
  getCourses: async (params?: GetCoursesPayload): Promise<GetCoursesResponse> => {
    const response = await axiosInstance.get<GetCoursesResponse>('/courses', {
      params,
    });
    return response.data;
  },

  getCourseMembers: async (courseId: string, params?: GetMembersPayload): Promise<GetMembersResponse> => {
    const response = await axiosInstance.get<GetMembersResponse>(`/courses/${courseId}/members`, {
      params,
    });
    return response.data;
  },
};

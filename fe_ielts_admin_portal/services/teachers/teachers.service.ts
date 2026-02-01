import axiosInstance from '@/config/axios.config';
import { TeacherDropdown, TeachersDropdownResponse } from '@/types/teachers';

export const teachersService = {
  getDropdown: async (): Promise<TeacherDropdown[]> => {
    const response = await axiosInstance.get<TeachersDropdownResponse>('/teachers/dropdown');
    return response.data.data.teachers;
  },
};

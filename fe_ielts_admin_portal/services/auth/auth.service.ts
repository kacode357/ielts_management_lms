import axiosInstance from '@/config/axios.config';
import { LoginPayload, LoginResponse } from '@/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },
};

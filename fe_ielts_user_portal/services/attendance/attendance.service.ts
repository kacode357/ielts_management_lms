import axiosInstance from "@/config/axios.config";
import {
  GetAttendanceListResponse,
  RecordAttendanceRequest,
  RecordAttendanceResponse,
  GetStudentAttendanceHistoryResponse,
} from "@/types/attendance";

export const attendanceService = {
  // Get attendance list for a schedule
  getScheduleAttendance: async (scheduleId: string): Promise<GetAttendanceListResponse> => {
    const response = await axiosInstance.get<GetAttendanceListResponse>(
      `/attendance/schedule/${scheduleId}`
    );
    return response.data;
  },

  // Record or update attendance
  recordAttendance: async (
    scheduleId: string,
    data: RecordAttendanceRequest
  ): Promise<RecordAttendanceResponse> => {
    const response = await axiosInstance.post<RecordAttendanceResponse>(
      `/attendance/schedule/${scheduleId}`,
      data
    );
    return response.data;
  },

  // Get student attendance history
  getStudentAttendanceHistory: async (
    studentId: string,
    courseId?: string
  ): Promise<GetStudentAttendanceHistoryResponse> => {
    const params = courseId ? { courseId } : {};
    const response = await axiosInstance.get<GetStudentAttendanceHistoryResponse>(
      `/attendance/student/${studentId}`,
      { params }
    );
    return response.data;
  },
};

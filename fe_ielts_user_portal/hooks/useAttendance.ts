import { useState } from "react";
import { attendanceService } from "@/services/attendance";
import {
  GetAttendanceListResponse,
  RecordAttendanceRequest,
  GetStudentAttendanceHistoryResponse,
} from "@/types/attendance";
import toast from "react-hot-toast";

export const useAttendance = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getScheduleAttendance = async (scheduleId: string) => {
    try {
      setIsLoading(true);
      const data = await attendanceService.getScheduleAttendance(scheduleId);
      return data;
    } catch (error) {
      console.error("Get schedule attendance error:", error);
      toast.error("Failed to load attendance");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const recordAttendance = async (scheduleId: string, data: RecordAttendanceRequest) => {
    try {
      setIsLoading(true);
      const response = await attendanceService.recordAttendance(scheduleId, data);
      toast.success("Attendance recorded successfully");
      return response;
    } catch (error) {
      console.error("Record attendance error:", error);
      toast.error("Failed to record attendance");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentAttendanceHistory = async (studentId: string, courseId?: string) => {
    try {
      setIsLoading(true);
      const data = await attendanceService.getStudentAttendanceHistory(studentId, courseId);
      return data;
    } catch (error) {
      console.error("Get student attendance history error:", error);
      toast.error("Failed to load attendance history");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getScheduleAttendance,
    recordAttendance,
    getStudentAttendanceHistory,
  };
};

import { AttendanceSummary } from "../attendance";

// Student's own attendance record
export interface MyAttendance {
  status: "present" | "absent";
  notes: string;
  recordedAt: string;
}

export interface CourseInfo {
  _id: string;
  name: string;
  code: string;
  level: string;
}

export interface Schedule {
  _id: string;
  courseId: CourseInfo;
  sessionNumber: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  __v?: number;
  attendanceSummary?: AttendanceSummary;
  myAttendance?: MyAttendance | null; // Student's own attendance (only for students)
}

export interface GetScheduleResponse {
  success: boolean;
  data: {
    schedules: Schedule[];
    total: number;
  };
}

/**
 * Attendance Types and Interfaces
 * Matches BE enums from ATTENDANCE_STATUS and ATTENDANCE_SUMMARY_STATUS
 */

// Individual student attendance status
// BE: ATTENDANCE_STATUS = { PRESENT: "present", ABSENT: "absent" }
export type AttendanceStatus = "present" | "absent";

// Attendance summary status (schedule overview)
// BE: ATTENDANCE_SUMMARY_STATUS = { NOT_YET: "not_yet", ABSENT: "absent", ATTENDED: "attended" }
export type AttendanceSummaryStatus = "not_yet" | "absent" | "attended";

// Attendance summary in schedule
export interface AttendanceSummary {
  totalStudents: number;
  recorded: number;
  notRecorded: number;
  present: number;
  absent: number;
  status: AttendanceSummaryStatus;
  isAttendanceTaken: boolean;
}

// Student attendance record
export interface StudentAttendance {
  studentId: string;
  studentCode: string;
  studentName: string;
  email: string;
  currentLevel: string;
  targetBand: number;
  status: AttendanceStatus | null;
  notes: string | null;
  recordedAt: string | null;
  recordedBy: string | null;
  attendanceId: string | null;
}

// Get attendance list response
export interface GetAttendanceListResponse {
  success: boolean;
  data: {
    schedule: {
      _id: string;
      sessionNumber: number;
      title: string;
      date: string;
      startTime: string;
      endTime: string;
      room: string;
      status: string;
    };
    course: {
      _id: string;
      name: string;
      code: string;
      level: string;
    };
    mainTeacher: {
      _id: string;
      teacherCode: string;
      name: string;
    } | null;
    substituteTeacher: {
      _id: string;
      teacherCode: string;
      name: string;
    } | null;
    students: StudentAttendance[];
    summary: {
      totalStudents: number;
      recorded: number;
      notRecorded: number;
    };
  };
}

// Record attendance request
export interface RecordAttendanceRequest {
  attendanceList: Array<{
    studentId: string;
    status: AttendanceStatus;
    notes?: string;
  }>;
  markScheduleCompleted?: boolean;
}

// Record attendance response
export interface RecordAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    recorded: number;
    updated: number;
  };
}

// Student attendance history item
export interface StudentAttendanceHistoryItem {
  _id: string;
  scheduleId: string;
  sessionNumber: number;
  sessionTitle: string;
  date: string;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  status: AttendanceStatus;
  notes: string | null;
  recordedAt: string;
  recordedBy: string;
}

// Get student attendance history response
export interface GetStudentAttendanceHistoryResponse {
  success: boolean;
  data: {
    student: {
      _id: string;
      studentCode: string;
      name: string;
      email: string;
    };
    attendances: StudentAttendanceHistoryItem[];
    summary: {
      total: number;
      present: number;
      absent: number;
      late: number;
      excused: number;
      attendanceRate: number;
    };
  };
}

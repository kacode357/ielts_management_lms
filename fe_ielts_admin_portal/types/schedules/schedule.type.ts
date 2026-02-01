export interface ScheduleCourse {
  _id: string;
  name: string;
  code: string;
  level: string;
}

export interface ScheduleTeacher {
  _id: string;
  name: string;
  teacherCode: string;
  specialization?: string;
}

export interface AttendanceSummary {
  totalStudents: number;
  recorded: number;
  notRecorded: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  status: string;
  isAttendanceTaken: boolean;
}

export interface Schedule {
  _id: string;
  courseId: ScheduleCourse;
  sessionNumber: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  isCancelled: boolean;
  cancellationReason?: string;
  __v?: number;
  createdAt: string;
  updatedAt: string;
  computedStatus: 'past' | 'today' | 'upcoming' | 'cancelled';
  attendanceSummary?: AttendanceSummary;
  teacherId?: ScheduleTeacher;
  substituteTeacherId?: ScheduleTeacher;
  internalNotes?: string;
}

export interface ScheduleFilters {
  page?: number;
  limit?: number;
  courseId?: string;
  computedStatus?: 'past' | 'today' | 'upcoming' | 'cancelled';
  fromDate?: string;
  toDate?: string;
  teacherId?: string;
}

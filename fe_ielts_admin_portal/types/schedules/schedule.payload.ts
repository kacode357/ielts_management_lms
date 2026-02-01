import { Schedule, ScheduleFilters } from './schedule.type';

export interface GenerateSchedulesPayload {
  courseId: string;
  weekDays: number[];
  startTime: string;
  endTime: string;
  room?: string;
}

export interface UpdateSchedulePayload {
  date?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  isCancelled?: boolean;
  cancellationReason?: string;
  lessonId?: string;
  substituteTeacherId?: string;
  internalNotes?: string;
}

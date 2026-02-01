import { Schedule } from './schedule.type';

export interface SchedulesResponse {
  success: boolean;
  data: {
    schedules: Schedule[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ScheduleResponse {
  success: boolean;
  data: Schedule;
}

export interface GenerateSchedulesResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    schedules: Schedule[];
  };
}

export interface UpdateScheduleResponse {
  success: boolean;
  data: Schedule;
  message?: string;
}

export interface DeleteScheduleResponse {
  success: boolean;
  message: string;
}

export interface DeleteSchedulesByCourseResponse {
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
  };
}

export interface ScheduleErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

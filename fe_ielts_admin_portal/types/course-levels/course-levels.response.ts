import { CourseLevel } from './course-levels.type';

export interface CourseLevelsResponse {
  success: boolean;
  data: CourseLevel[];
}

export interface CourseLevelResponse {
  success: boolean;
  data: CourseLevel;
}

export interface CreateCourseLevelResponse {
  success: boolean;
  data: CourseLevel;
  message: string;
}

export interface UpdateCourseLevelResponse {
  success: boolean;
  data: CourseLevel;
  message: string;
}

export interface DeleteCourseLevelResponse {
  success: boolean;
  message: string;
}

export interface ReorderCourseLevelsResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
}

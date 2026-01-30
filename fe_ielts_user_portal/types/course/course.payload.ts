export interface GetCoursesPayload {
  page?: number;
  limit?: number;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  level?: string;
  isActive?: boolean;
}

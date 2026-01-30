export interface GetSchedulePayload {
  fromDate?: string;
  toDate?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
}

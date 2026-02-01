"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useSchedules, useGenerateSchedules, useUpdateSchedule, useDeleteSchedule } from '@/hooks/schedules';
import { useCourses } from '@/hooks/courses';
import { Schedule } from '@/types/schedules';
import { GenerateSchedulesPayload } from '@/types/schedules';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ScheduleFilters {
  page?: number;
  limit?: number;
  courseId?: string;
  computedStatus?: 'past' | 'today' | 'upcoming' | 'cancelled';
  fromDate?: string;
  toDate?: string;
}

const WEEK_DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function SchedulesPage() {
  const [filters, setFilters] = useState<ScheduleFilters>({ page: 1, limit: 50 });
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // Generate form state
  const [generateForm, setGenerateForm] = useState<GenerateSchedulesPayload>({
    courseId: '',
    weekDays: [],
    startTime: '19:00',
    endTime: '21:00',
    room: '',
  });
  const [generateErrors, setGenerateErrors] = useState<Record<string, string>>({});

  // Edit form state
  const [editForm, setEditForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    room: '',
    isCancelled: false,
    cancellationReason: '',
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const { schedules, pagination, isLoading, refetch } = useSchedules(filters);
  const { courses, fetchCourses } = useCourses();
  const { generateSchedules, isLoading: isGenerating } = useGenerateSchedules();
  const { updateSchedule, isLoading: isUpdating } = useUpdateSchedule();
  const { deleteSchedule } = useDeleteSchedule();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const validateGenerateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!generateForm.courseId) errors.courseId = 'Course is required';
    if (!generateForm.weekDays.length) errors.weekDays = 'Select at least one weekday';
    if (!generateForm.startTime) errors.startTime = 'Start time is required';
    if (!generateForm.endTime) errors.endTime = 'End time is required';
    setGenerateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGenerateForm()) return;

    const result = await generateSchedules(generateForm);
    if (result.success) {
      setIsGenerateModalOpen(false);
      setGenerateForm({ courseId: '', weekDays: [], startTime: '19:00', endTime: '21:00', room: '' });
      refetch(filters);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;

    const result = await updateSchedule(selectedSchedule._id, editForm);
    if (result.success) {
      setIsEditModalOpen(false);
      setSelectedSchedule(null);
      refetch(filters);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      const result = await deleteSchedule(id);
      if (result.success) {
        refetch(filters);
      }
    }
  };

  const openEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditForm({
      date: schedule.date.split('T')[0],
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      room: schedule.room,
      isCancelled: schedule.isCancelled,
      cancellationReason: schedule.cancellationReason || '',
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      past: 'bg-gray-100 text-gray-800',
      today: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const toggleWeekDay = (day: number) => {
    setGenerateForm(prev => ({
      ...prev,
      weekDays: prev.weekDays.includes(day)
        ? prev.weekDays.filter(d => d !== day)
        : [...prev.weekDays, day].sort(),
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            Generate Schedules
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.courseId || ''}
                onChange={(e) => setFilters({ ...filters, courseId: e.target.value || undefined, page: 1 })}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.computedStatus || ''}
                onChange={(e) => setFilters({ ...filters, computedStatus: e.target.value as any || undefined, page: 1 })}
              >
                <option value="">All Status</option>
                <option value="past">Past</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <Input
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value || undefined, page: 1 })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <Input
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value || undefined, page: 1 })}
              />
            </div>
          </div>
        </div>

        {/* Schedules Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading schedules...</div>
          ) : schedules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No schedules found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule._id} className={schedule.isCancelled ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Session {schedule.sessionNumber}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{schedule.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.courseId?.name}</div>
                      <div className="text-sm text-gray-500">{schedule.courseId?.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(schedule.date)}</div>
                      <div className="text-sm text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(schedule.computedStatus)}`}>
                        {schedule.computedStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(schedule)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={pagination.page === pagination.pages}
                onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Schedule Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Generate Schedules</h2>
            </div>
            <form onSubmit={handleGenerateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <select
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${generateErrors.courseId ? 'border-red-500' : 'border-gray-200'}`}
                  value={generateForm.courseId}
                  onChange={(e) => setGenerateForm({ ...generateForm, courseId: e.target.value })}
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>{course.name} ({course.code})</option>
                  ))}
                </select>
                {generateErrors.courseId && <p className="text-red-500 text-xs mt-1">{generateErrors.courseId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Week Days *</label>
                <div className="flex flex-wrap gap-2">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeekDay(day.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        generateForm.weekDays.includes(day.value)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                {generateErrors.weekDays && <p className="text-red-500 text-xs mt-1">{generateErrors.weekDays}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
                  <Input
                    type="time"
                    value={generateForm.startTime}
                    onChange={(e) => setGenerateForm({ ...generateForm, startTime: e.target.value })}
                    className={generateErrors.startTime ? 'border-red-500' : ''}
                  />
                  {generateErrors.startTime && <p className="text-red-500 text-xs mt-1">{generateErrors.startTime}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
                  <Input
                    type="time"
                    value={generateForm.endTime}
                    onChange={(e) => setGenerateForm({ ...generateForm, endTime: e.target.value })}
                    className={generateErrors.endTime ? 'border-red-500' : ''}
                  />
                  {generateErrors.endTime && <p className="text-red-500 text-xs mt-1">{generateErrors.endTime}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room (optional)</label>
                <Input
                  type="text"
                  value={generateForm.room}
                  onChange={(e) => setGenerateForm({ ...generateForm, room: e.target.value })}
                  placeholder="Will use course default if empty"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isGenerating}>
                  Generate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {isEditModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Edit Schedule</h2>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Session {selectedSchedule.sessionNumber} - {selectedSchedule.title}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <Input
                    type="time"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <Input
                    type="time"
                    value={editForm.endTime}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <Input
                  type="text"
                  value={editForm.room}
                  onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCancelled"
                  checked={editForm.isCancelled}
                  onChange={(e) => setEditForm({ ...editForm, isCancelled: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isCancelled" className="text-sm font-medium text-gray-700">
                  Cancel this session
                </label>
              </div>

              {editForm.isCancelled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
                  <textarea
                    value={editForm.cancellationReason}
                    onChange={(e) => setEditForm({ ...editForm, cancellationReason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Enter reason for cancellation"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isUpdating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

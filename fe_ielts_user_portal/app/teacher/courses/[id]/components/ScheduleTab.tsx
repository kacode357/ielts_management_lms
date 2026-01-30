import { useState } from "react";
import { Schedule } from "@/types/schedule";
import { Calendar, Clock, MapPin, Users, ClipboardCheck, Eye } from "lucide-react";
import AttendanceModal from "./AttendanceModal";
import ViewAttendanceModal from "./ViewAttendanceModal";

interface ScheduleTabProps {
  schedules: Schedule[];
  isLoading: boolean;
  onRefresh?: () => void;
}

export default function ScheduleTab({ schedules, isLoading, onRefresh }: ScheduleTabProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [viewSchedule, setViewSchedule] = useState<Schedule | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="w-16 h-16 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium text-gray-600">No schedule found</p>
        <p className="text-sm text-gray-400 mt-1">Schedule will appear here once created</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="relative">
          {schedules
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((schedule, index) => {
              const scheduleDate = new Date(schedule.date);
              const isToday = new Date().toDateString() === scheduleDate.toDateString();
              const isPast = scheduleDate < new Date() && !isToday;

              return (
                <div
                  key={schedule._id}
                  className={`flex gap-4 ${index !== schedules.length - 1 ? "pb-4" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isToday
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : isPast
                            ? "bg-gray-200 text-gray-500"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {schedule.sessionNumber}
                    </div>
                    {index !== schedules.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-2 ${isPast ? "bg-gray-200" : "bg-blue-200"}`} />
                    )}
                  </div>

                  <div
                    className={`flex-1 rounded-xl p-4 border-2 transition-all duration-200 ${
                      isToday
                        ? "bg-blue-50 border-blue-300 shadow-md"
                        : isPast
                          ? "bg-gray-50 border-gray-200"
                          : "bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">Session {schedule.sessionNumber}</h4>
                          {isToday && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-medium rounded-full">
                              Today
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 wrap-break-word">{schedule.title}</p>
                      </div>
                      {schedule.attendanceSummary && (
                        <span
                          className={`self-start shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                            schedule.attendanceSummary.isAttendanceTaken
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {schedule.attendanceSummary.isAttendanceTaken ? "Taken" : "Not Yet"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">
                          {scheduleDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate">{schedule.room}</span>
                      </span>
                    </div>

                    {schedule.attendanceSummary && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Attendance</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {isPast && schedule.attendanceSummary.isAttendanceTaken && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewSchedule(schedule);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden xs:inline">View</span> Attendance
                              </button>
                            )}
                            {isToday && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSchedule(schedule);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                              >
                                <ClipboardCheck className="w-4 h-4" />
                                {schedule.attendanceSummary.isAttendanceTaken ? "Edit" : "Take"} Attendance
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900">
                              {schedule.attendanceSummary.totalStudents}
                            </div>
                            <div className="text-xs text-gray-500">Total Students</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {schedule.attendanceSummary.present}
                            </div>
                            <div className="text-xs text-gray-500">Present</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Attendance Modal */}
      {selectedSchedule && (
        <AttendanceModal
          isOpen={!!selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          scheduleId={selectedSchedule._id}
          sessionTitle={selectedSchedule.title}
          sessionNumber={selectedSchedule.sessionNumber}
          onSuccess={() => {
            setSelectedSchedule(null);
            onRefresh?.();
          }}
        />
      )}

      {/* View Attendance Modal */}
      {viewSchedule && (
        <ViewAttendanceModal
          isOpen={!!viewSchedule}
          onClose={() => setViewSchedule(null)}
          scheduleId={viewSchedule._id}
          sessionTitle={viewSchedule.title}
          sessionNumber={viewSchedule.sessionNumber}
        />
      )}
    </div>
  );
}

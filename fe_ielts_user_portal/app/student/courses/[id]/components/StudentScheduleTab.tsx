"use client";
import { Schedule } from "@/types/schedule";
import { Calendar, Clock, MapPin, UserCheck, UserX, AlertCircle } from "lucide-react";

interface StudentScheduleTabProps {
  schedules: Schedule[];
  isLoading: boolean;
}

export default function StudentScheduleTab({ schedules, isLoading }: StudentScheduleTabProps) {
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
                  className={`flex-1 rounded-xl p-3 sm:p-4 border-2 transition-all duration-200 ${
                    isToday
                      ? "bg-blue-50 border-blue-300 shadow-md"
                      : isPast
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200"
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

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-700">Your Attendance</span>
                      {schedule.myAttendance ? (
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                            schedule.myAttendance.status === "present"
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          {schedule.myAttendance.status === "present" ? (
                            <>
                              <UserCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">Present</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Absent</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-gray-50 border-gray-200 self-start sm:self-auto">
                          <AlertCircle className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-600">Not Recorded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

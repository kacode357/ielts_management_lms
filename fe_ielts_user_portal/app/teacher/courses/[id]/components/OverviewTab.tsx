import { Card } from "@/components/ui/Card";
import { Course } from "@/types/course";
import {
  GraduationCap,
  Clock,
  Users,
  MapPin,
  CalendarDays,
  User as UserIcon,
  ChevronRight,
} from "lucide-react";

interface OverviewTabProps {
  course: Course;
  onViewMembers: () => void;
}

export default function OverviewTab({ course, onViewMembers }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 sm:p-4 border border-blue-100">
            <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 mb-1.5 sm:mb-2">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium">Level</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">{course.level}</p>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-xl p-3 sm:p-4 border border-green-100">
            <div className="flex items-center gap-1.5 sm:gap-2 text-green-600 mb-1.5 sm:mb-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium">Total Hours</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">{course.totalHours}h</p>
          </div>
          <div className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 sm:p-4 border border-purple-100">
            <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 mb-1.5 sm:mb-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium">Students</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {course.currentStudents}/{course.maxStudents}
            </p>
          </div>
          <div className="bg-linear-to-br from-orange-50 to-orange-100/50 rounded-xl p-3 sm:p-4 border border-orange-100">
            <div className="flex items-center gap-1.5 sm:gap-2 text-orange-600 mb-1.5 sm:mb-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium">Room</span>
            </div>
            <p className="text-base sm:text-lg font-bold text-gray-900">{course.room}</p>
          </div>
        </div>

        <Card className="p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Schedule Details
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 gap-1 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-600">Duration</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {new Date(course.startDate).toLocaleDateString()} -{" "}
                {new Date(course.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-1 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-600">Class Schedule</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900">{course.scheduleDesc}</span>
            </div>
          </div>
        </Card>
      </div>

      {course.teacherId && (
        <Card className="p-4 sm:p-5 h-fit">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-600" />
            Teacher
          </h3>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{course.teacherId.teacherCode}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Teacher Code</p>
            </div>
          </div>
          <button
            onClick={onViewMembers}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            View All Members
            <ChevronRight className="w-4 h-4" />
          </button>
        </Card>
      )}
    </div>
  );
}

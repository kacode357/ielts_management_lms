import { TeacherMember, StudentMember, MembersPagination } from "@/types/course";
import { User as UserIcon, Users, Mail, Phone, Target } from "lucide-react";

interface MembersTabProps {
  teacher: TeacherMember | null;
  students: StudentMember[];
  pagination: MembersPagination | null;
  isLoading: boolean;
}

export default function MembersTab({ teacher, students, pagination, isLoading }: MembersTabProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {teacher && (
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-600" />
            Teacher
          </h3>
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                  <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0 sm:hidden">
                  <p className="font-bold text-gray-900 text-base truncate">
                    {teacher.user.firstName} {teacher.user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{teacher.specialization}</p>
                </div>
              </div>
              <div className="flex-1 min-w-0 hidden sm:block">
                <p className="font-bold text-gray-900 text-lg">
                  {teacher.user.firstName} {teacher.user.lastName}
                </p>
                <p className="text-sm text-gray-600">{teacher.specialization}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Mail className="w-3 h-3" />
                    {teacher.user.email}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Phone className="w-3 h-3" />
                    {teacher.user.phone}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:hidden">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-37.5">{teacher.user.email}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="w-3 h-3" />
                  {teacher.user.phone}
                </span>
              </div>
              <span className="self-start sm:self-center px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                {teacher.teacherCode}
              </span>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-green-600" />
          Students ({pagination?.total || 0})
        </h3>
        {students.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {students.map((item) => (
              <div
                key={item.enrollmentId}
                className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-xs sm:text-sm">
                      {item.student.user.firstName[0]}
                      {item.student.user.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.student.user.firstName} {item.student.user.lastName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{item.student.studentCode}</p>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-50 text-orange-700 rounded-full shrink-0">
                    <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="text-[10px] sm:text-xs font-medium">{item.student.targetBand}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-xs text-gray-500 gap-1 sm:gap-0">
                  <span className="flex items-center gap-1 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.student.user.email}</span>
                  </span>
                  <span className="text-gray-400">Level: {item.student.currentLevel}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No students enrolled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

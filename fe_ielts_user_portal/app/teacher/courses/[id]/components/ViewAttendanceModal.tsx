import { useState, useEffect } from "react";
import { X, UserCheck, UserX, AlertCircle } from "lucide-react";
import { StudentAttendance } from "@/types/attendance";
import { useAttendance } from "@/hooks";

interface ViewAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  sessionTitle: string;
  sessionNumber: number;
}

export default function ViewAttendanceModal({
  isOpen,
  onClose,
  scheduleId,
  sessionTitle,
  sessionNumber,
}: ViewAttendanceModalProps) {
  const { getScheduleAttendance, isLoading } = useAttendance();
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [summary, setSummary] = useState({ totalStudents: 0, recorded: 0, notRecorded: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const fetchAttendance = async () => {
      try {
        const response = await getScheduleAttendance(scheduleId);
        setStudents(response.data.students);
        setSummary(response.data.summary);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scheduleId]);

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case "present":
        return {
          icon: UserCheck,
          text: "Present",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "absent":
        return {
          icon: UserX,
          text: "Absent",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Not Recorded",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const presentCount = students.filter((s) => s.status === "present").length;
  const absentCount = students.filter((s) => s.status === "absent").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Attendance Record</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              Session {sessionNumber}: {sessionTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ml-2 shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Summary */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{summary.totalStudents}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-xs text-gray-500">Absent</div>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => {
                const statusInfo = getStatusInfo(student.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div
                    key={student.studentId}
                    className={`rounded-xl p-3 sm:p-4 border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {student.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{student.studentName}</h4>
                            <span className="text-xs text-gray-500">({student.studentCode})</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">{student.email}</p>
                          {student.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic truncate">Note: {student.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border self-start sm:self-auto shrink-0 ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                        <span className={`text-xs sm:text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

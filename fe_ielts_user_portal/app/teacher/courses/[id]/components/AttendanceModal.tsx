import { useState, useEffect, useCallback } from "react";
import { X, UserCheck, UserX } from "lucide-react";
import { StudentAttendance, AttendanceStatus } from "@/types/attendance";
import { useAttendance } from "@/hooks";
import toast from "react-hot-toast";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  sessionTitle: string;
  sessionNumber: number;
  onSuccess?: () => void;
}

export default function AttendanceModal({
  isOpen,
  onClose,
  scheduleId,
  sessionTitle,
  sessionNumber,
  onSuccess,
}: AttendanceModalProps) {
  const { getScheduleAttendance, recordAttendance, isLoading } = useAttendance();
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    const fetchAttendance = async () => {
      try {
        const response = await getScheduleAttendance(scheduleId);
        setStudents(response.data.students);
        
        const initialAttendance: Record<string, AttendanceStatus> = {};
        const initialNotes: Record<string, string> = {};
        
        // Default all students to absent, then override with existing attendance
        response.data.students.forEach((student) => {
          initialAttendance[student.studentId] = student.status || "absent";
          if (student.notes) {
            initialNotes[student.studentId] = student.notes;
          }
        });
        
        setAttendanceData(initialAttendance);
        setNotes(initialNotes);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };

    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scheduleId]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNotesChange = (studentId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [studentId]: note }));
  };

  const handleSave = async () => {
    const attendanceList = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status,
      notes: notes[studentId] || undefined,
    }));

    if (attendanceList.length === 0) {
      toast.error("Please mark attendance for at least one student");
      return;
    }

    try {
      await recordAttendance(scheduleId, {
        attendanceList,
        markScheduleCompleted: false,
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };

  const getStatusButtonClass = (studentId: string, status: AttendanceStatus) => {
    const isSelected = attendanceData[studentId] === status;
    const baseClass = "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
    
    switch (status) {
      case "present":
        return `${baseClass} ${
          isSelected
            ? "bg-green-600 text-white shadow-md"
            : "bg-green-50 text-green-700 hover:bg-green-100"
        }`;
      case "absent":
        return `${baseClass} ${
          isSelected
            ? "bg-red-600 text-white shadow-md"
            : "bg-red-50 text-red-700 hover:bg-red-100"
        }`;
      default:
        return baseClass;
    }
  };

  const recordedCount = Object.keys(attendanceData).length;
  const totalCount = students.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Take Attendance</h2>
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

        {/* Progress */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <span className="text-blue-900 font-medium">
              Progress: {recordedCount} / {totalCount} students
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 sm:w-48 sm:flex-none bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (recordedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
              <span className="text-blue-900 font-semibold shrink-0">
                {totalCount > 0 ? Math.round((recordedCount / totalCount) * 100) : 0}%
              </span>
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
            <div className="space-y-3 sm:space-y-4">
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-xs sm:text-sm">
                        {student.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{student.studentName}</h4>
                        <span className="text-xs text-gray-500">({student.studentCode})</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 truncate">{student.email}</p>

                      {/* Status Buttons */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => handleStatusChange(student.studentId, "present")}
                          className={getStatusButtonClass(student.studentId, "present")}
                        >
                          <UserCheck className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs sm:text-sm">Present</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.studentId, "absent")}
                          className={getStatusButtonClass(student.studentId, "absent")}
                        >
                          <UserX className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs sm:text-sm">Absent</span>
                        </button>
                      </div>

                      {/* Notes Input */}
                      {attendanceData[student.studentId] && (
                        <input
                          type="text"
                          placeholder="Add notes (optional)"
                          value={notes[student.studentId] || ""}
                          onChange={(e) => handleNotesChange(student.studentId, e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || recordedCount === 0}
            className="px-4 sm:px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer text-sm sm:text-base"
          >
            {isLoading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}

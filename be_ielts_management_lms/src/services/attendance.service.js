// Attendance Service - Business Logic Layer
const mongoose = require("mongoose");
const Attendance = require("../models/attendance.model");
const Schedule = require("../models/schedule.model");
const Course = require("../models/course.model");
const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Enrollment = require("../models/enrollment.model");
const { AppError } = require("../utils/appError");
const MESSAGES = require("../constants/messages");
const { validateObjectId } = require("../utils/validation");
const {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LIST,
  ENROLLMENT_STATUS,
  USER_ROLES
} = require("../constants/enums");

class AttendanceService {
  /**
   * Get attendance list for a schedule (for teacher to take attendance)
   * @param {string} scheduleId - Schedule ID
   * @param {Object} user - Current user (from req.user)
   * @returns {Promise<Object>} List of students with their attendance status
   */
  async getAttendanceForSchedule(scheduleId, user) {
    // Validate scheduleId
    validateObjectId(scheduleId, "scheduleId");

    // Step 1: Get schedule info with course and teachers
    const schedule = await Schedule.findById(scheduleId)
      .populate({
        path: "courseId",
        select: "name code level teacherId",
        populate: {
          path: "teacherId",
          select: "_id teacherCode",
          populate: {
            path: "userId",
            select: "firstName lastName"
          }
        }
      })
      .populate({
        path: "substituteTeacherId",
        select: "_id teacherCode",
        populate: {
          path: "userId",
          select: "firstName lastName"
        }
      });

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    // Step 2: Validate permission (Critical for substitute teacher logic)
    if (user.role !== "admin") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError("Teacher profile not found", 404);
      }

      // Check if user is main teacher OR substitute teacher
      const isMainTeacher = schedule.courseId.teacherId?._id.toString() === teacher._id.toString();
      const isSubstituteTeacher = schedule.substituteTeacherId?._id.toString() === teacher._id.toString();

      if (!isMainTeacher && !isSubstituteTeacher) {
        throw new AppError("You do not have permission to access this schedule", 403);
      }
    }

    // Step 3.1: Get all enrolled students for this course
    const enrollments = await Enrollment.find({
      courseId: schedule.courseId._id,
      status: "active"
    })
      .populate({
        path: "studentId",
        select: "studentCode currentLevel targetBand",
        populate: {
          path: "userId",
          match: { isActive: true },
          select: "firstName lastName email"
        }
      })
      .sort({ "studentId.studentCode": 1 });

    // Filter out inactive students
    const activeEnrollments = enrollments.filter(e => e.studentId?.userId);

    // Step 3.2: Get existing attendance records for this schedule
    const existingAttendances = await Attendance.find({ scheduleId })
      .populate({
        path: "recordedBy",
        select: "firstName lastName"
      });

    // Create a map for quick lookup
    const attendanceMap = new Map();
    existingAttendances.forEach(att => {
      attendanceMap.set(att.studentId.toString(), att);
    });

    // Step 3.3: Merge - Combine enrollments with attendance records
    const studentList = activeEnrollments.map(enrollment => {
      const studentId = enrollment.studentId._id.toString();
      const existingAttendance = attendanceMap.get(studentId);

      return {
        studentId: enrollment.studentId._id,
        studentCode: enrollment.studentId.studentCode,
        studentName: `${enrollment.studentId.userId.firstName} ${enrollment.studentId.userId.lastName}`,
        email: enrollment.studentId.userId.email,
        currentLevel: enrollment.studentId.currentLevel,
        targetBand: enrollment.studentId.targetBand,
        // Attendance info (null if not yet recorded)
        status: existingAttendance?.status || null,
        notes: existingAttendance?.notes || null,
        recordedAt: existingAttendance?.recordedAt || null,
        recordedBy: existingAttendance?.recordedBy ? {
          _id: existingAttendance.recordedBy._id,
          name: `${existingAttendance.recordedBy.firstName} ${existingAttendance.recordedBy.lastName}`
        } : null,
        attendanceId: existingAttendance?._id || null
      };
    });

    // Return complete data
    return {
      schedule: {
        _id: schedule._id,
        sessionNumber: schedule.sessionNumber,
        title: schedule.title,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
        status: schedule.status,
        meetingUrl: schedule.meetingUrl
      },
      course: {
        _id: schedule.courseId._id,
        name: schedule.courseId.name,
        code: schedule.courseId.code,
        level: schedule.courseId.level
      },
      mainTeacher: schedule.courseId.teacherId ? {
        _id: schedule.courseId.teacherId._id,
        teacherCode: schedule.courseId.teacherId.teacherCode,
        name: `${schedule.courseId.teacherId.userId.firstName} ${schedule.courseId.teacherId.userId.lastName}`
      } : null,
      substituteTeacher: schedule.substituteTeacherId ? {
        _id: schedule.substituteTeacherId._id,
        teacherCode: schedule.substituteTeacherId.teacherCode,
        name: `${schedule.substituteTeacherId.userId.firstName} ${schedule.substituteTeacherId.userId.lastName}`,
        reason: schedule.internalNotes
      } : null,
      students: studentList,
      summary: {
        totalStudents: studentList.length,
        recorded: studentList.filter(s => s.status !== null).length,
        notRecorded: studentList.filter(s => s.status === null).length
      }
    };
  }

  /**
   * Record/Update attendance (Upsert operation)
   * @param {string} scheduleId - Schedule ID
   * @param {Array} attendanceList - Array of {studentId, status, notes}
   * @param {Object} user - Current user (from req.user)
   * @param {boolean} markScheduleCompleted - Whether to mark schedule as completed
   * @returns {Promise<Object>} Result summary
   */
  async recordAttendance(scheduleId, attendanceList, user, markScheduleCompleted = true) {
    // Validate scheduleId
    validateObjectId(scheduleId, "scheduleId");

    // Validate attendanceList
    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
      throw new AppError("attendanceList must be a non-empty array", 400);
    }

    // Step 1: Get schedule and validate permission
    const schedule = await Schedule.findById(scheduleId).populate("courseId");
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    // Validate permission (same logic as GET)
    if (user.role !== "admin") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError("Teacher profile not found", 404);
      }

      const isMainTeacher = schedule.courseId.teacherId?.toString() === teacher._id.toString();
      const isSubstituteTeacher = schedule.substituteTeacherId?.toString() === teacher._id.toString();

      if (!isMainTeacher && !isSubstituteTeacher) {
        throw new AppError("You do not have permission to record attendance for this schedule", 403);
      }
    }

    // Step 2: Process each attendance record (Upsert)
    const results = {
      successful: [],
      failed: []
    };

    for (const item of attendanceList) {
      try {
        const { studentId, status, notes } = item;

        // Validate studentId
        validateObjectId(studentId, "studentId");

        // Validate status
        if (!ATTENDANCE_STATUS_LIST.includes(status)) {
          throw new AppError(`Invalid status: ${status}. Must be one of: ${ATTENDANCE_STATUS_LIST.join(", ")}`, 400);
        }

        // Check if student is enrolled in this course
        const enrollment = await Enrollment.findOne({
          courseId: schedule.courseId._id,
          studentId,
          status: ENROLLMENT_STATUS.ACTIVE
        });

        if (!enrollment) {
          results.failed.push({
            studentId,
            reason: "Student is not enrolled in this course"
          });
          continue;
        }

        // UPSERT: Update if exists, create if not
        const attendanceRecord = await Attendance.findOneAndUpdate(
          {
            scheduleId,
            studentId
          },
          {
            status,
            notes: notes || "",
            recordedBy: user.userId, // THIS IS KEY: Record who did the attendance
            recordedAt: new Date()
          },
          {
            new: true,
            upsert: true, // Create if not exists
            runValidators: true
          }
        ).populate({
          path: "studentId",
          select: "studentCode",
          populate: {
            path: "userId",
            select: "firstName lastName"
          }
        });

        results.successful.push({
          attendanceId: attendanceRecord._id,
          studentId: attendanceRecord.studentId._id,
          studentCode: attendanceRecord.studentId.studentCode,
          studentName: `${attendanceRecord.studentId.userId.firstName} ${attendanceRecord.studentId.userId.lastName}`,
          status: attendanceRecord.status,
          notes: attendanceRecord.notes
        });

      } catch (error) {
        results.failed.push({
          studentId: item.studentId,
          reason: error.message || "Unknown error"
        });
      }
    }

    // Step 3: Schedule status is now computed from date, no need to update

    // Calculate summary
    const summary = {
      total: attendanceList.length,
      successful: results.successful.length,
      failed: results.failed.length
    };

    return {
      summary,
      successful: results.successful,
      failed: results.failed
    };
  }

  /**
   * Get student attendance history
   * @param {string} studentId - Student ID
   * @param {Object} user - Current user
   * @param {string} courseId - Optional course filter
   * @returns {Promise<Object>} Attendance history
   */
  async getStudentAttendance(studentId, user, courseId = null) {
    // Validate studentId
    validateObjectId(studentId, "studentId");
    if (courseId) validateObjectId(courseId, "courseId");

    // Check if student exists
    const student = await Student.findById(studentId).populate("userId", "firstName lastName");
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    // Permission check
    if (user.role === "student") {
      // Student can only view their own attendance
      const ownStudent = await Student.findOne({ userId: user.userId });
      if (!ownStudent || ownStudent._id.toString() !== studentId) {
        throw new AppError("You can only view your own attendance", 403);
      }
    } else if (user.role === "teacher") {
      // Teacher can only view students in their courses
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError("Teacher profile not found", 404);
      }

      // Check if student is in any of teacher's courses
      const teacherCourses = await Course.find({ teacherId: teacher._id }).select("_id");
      const courseIds = teacherCourses.map(c => c._id);

      const enrollment = await Enrollment.findOne({
        studentId,
        courseId: { $in: courseIds },
        status: "active"
      });

      if (!enrollment) {
        throw new AppError("You can only view attendance of students in your courses", 403);
      }
    }
    // Admin can view all

    // Build query
    const query = { studentId };

    // Get attendance records
    const attendances = await Attendance.find(query)
      .populate({
        path: "scheduleId",
        select: "sessionNumber title date startTime endTime courseId status",
        populate: {
          path: "courseId",
          select: "name code level",
          match: courseId ? { _id: courseId } : {}
        }
      })
      .populate({
        path: "recordedBy",
        select: "firstName lastName"
      })
      .sort({ "scheduleId.date": -1 });

    // Filter out if courseId doesn't match
    const filteredAttendances = attendances.filter(att => 
      att.scheduleId && att.scheduleId.courseId
    );

    // Format response
    const attendanceHistory = filteredAttendances.map(att => ({
      _id: att._id,
      schedule: {
        _id: att.scheduleId._id,
        sessionNumber: att.scheduleId.sessionNumber,
        title: att.scheduleId.title,
        date: att.scheduleId.date,
        startTime: att.scheduleId.startTime,
        endTime: att.scheduleId.endTime,
        status: att.scheduleId.status
      },
      course: {
        _id: att.scheduleId.courseId._id,
        name: att.scheduleId.courseId.name,
        code: att.scheduleId.courseId.code,
        level: att.scheduleId.courseId.level
      },
      status: att.status,
      notes: att.notes,
      recordedAt: att.recordedAt,
      recordedBy: att.recordedBy ? {
        _id: att.recordedBy._id,
        name: `${att.recordedBy.firstName} ${att.recordedBy.lastName}`
      } : null
    }));

    // Calculate statistics
    const stats = {
      total: attendanceHistory.length,
      present: attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length,
      absent: attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length,
      late: attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.LATE).length,
      excused: attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.EXCUSED).length,
      attendanceRate: attendanceHistory.length > 0 
        ? ((attendanceHistory.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length / attendanceHistory.length) * 100).toFixed(2)
        : 0
    };

    return {
      student: {
        _id: student._id,
        studentCode: student.studentCode,
        name: `${student.userId.firstName} ${student.userId.lastName}`,
        currentLevel: student.currentLevel,
        targetBand: student.targetBand
      },
      statistics: stats,
      attendanceHistory
    };
  }
}

module.exports = new AttendanceService();

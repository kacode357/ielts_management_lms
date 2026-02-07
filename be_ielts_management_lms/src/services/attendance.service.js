// Attendance Service - MongoDB Driver
const Attendance = require("../models/attendance.model");
const Schedule = require("../models/schedule.model");
const Course = require("../models/course.model");
const Teacher = require("../models/teacher.model");
const Student = require("../models/student.model");
const Enrollment = require("../models/enrollment.model");
const { AppError } = require("../utils/appError");
const { validateObjectId } = require("../utils/validation");
const { ATTENDANCE_STATUS_LIST, ENROLLMENT_STATUS } = require("../constants/enums");

class AttendanceService {
  async getAttendanceForSchedule(scheduleId, user) {
    validateObjectId(scheduleId, "scheduleId");

    // Get schedule
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    // Get course
    const course = await Course.findById(schedule.courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Get teacher info
    let mainTeacher = null;
    if (course.teacherId) {
      const teacher = await Teacher.findById(course.teacherId);
      if (teacher) {
        mainTeacher = {
          _id: teacher._id,
          teacherCode: teacher.teacherCode,
        };
      }
    }

    // Get substitute teacher
    let substituteTeacher = null;
    if (schedule.substituteTeacherId) {
      const teacher = await Teacher.findById(schedule.substituteTeacherId);
      if (teacher) {
        substituteTeacher = {
          _id: teacher._id,
          teacherCode: teacher.teacherCode,
        };
      }
    }

    // Get enrolled students
    const enrollments = await Enrollment.find({
      courseId: course._id,
      status: "active"
    });

    // Get existing attendance records
    const existingAttendances = await Attendance.find({ scheduleId });

    // Create a map for quick lookup
    const attendanceMap = new Map();
    existingAttendances.forEach(att => {
      attendanceMap.set(att.studentId.toString(), att);
    });

    // Merge enrollments with attendance
    const studentList = await Promise.all(enrollments.map(async (enrollment) => {
      const student = await Student.findById(enrollment.studentId);
      if (!student) return null;
      
      const userInfo = await User.findById(student.userId);
      if (!userInfo || !userInfo.isActive) return null;
      
      const existingAttendance = attendanceMap.get(student._id.toString());
      
      return {
        studentId: student._id,
        studentCode: student.studentCode,
        studentName: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        currentLevel: student.currentLevel,
        targetBand: student.targetBand,
        status: existingAttendance?.status || null,
        notes: existingAttendance?.notes || null,
        recordedAt: existingAttendance?.recordedAt || null,
        attendanceId: existingAttendance?._id || null
      };
    }));

    const activeStudents = studentList.filter(s => s !== null);

    return {
      schedule: {
        _id: schedule._id,
        sessionNumber: schedule.sessionNumber,
        title: schedule.title,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
      },
      course: {
        _id: course._id,
        name: course.name,
        code: course.code,
        level: course.level,
      },
      mainTeacher,
      substituteTeacher,
      students: activeStudents,
      summary: {
        totalStudents: activeStudents.length,
        recorded: activeStudents.filter(s => s.status !== null).length,
        notRecorded: activeStudents.filter(s => s.status === null).length
      }
    };
  }

  async recordAttendance(scheduleId, attendanceList, user, markScheduleCompleted = true) {
    validateObjectId(scheduleId, "scheduleId");

    if (!Array.isArray(attendanceList) || attendanceList.length === 0) {
      throw new AppError("attendanceList must be a non-empty array", 400);
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const item of attendanceList) {
      try {
        const { studentId, status, notes } = item;

        validateObjectId(studentId, "studentId");

        if (!ATTENDANCE_STATUS_LIST.includes(status)) {
          throw new AppError(`Invalid status: ${status}`, 400);
        }

        // Check if student is enrolled
        const enrollment = await Enrollment.findOne({
          courseId: schedule.courseId,
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

        // Upsert attendance record
        const existing = await Attendance.findOne({ scheduleId, studentId });
        
        if (existing) {
          await Attendance.updateById(existing._id, {
            status,
            notes: notes || "",
            recordedAt: new Date()
          });
        } else {
          await Attendance.create({
            scheduleId,
            studentId,
            status,
            notes: notes || "",
            recordedAt: new Date()
          });
        }

        results.successful.push({ studentId, status });

      } catch (error) {
        results.failed.push({
          studentId: item.studentId,
          reason: error.message || "Unknown error"
        });
      }
    }

    const summary = {
      total: attendanceList.length,
      successful: results.successful.length,
      failed: results.failed.length
    };

    return { summary, successful: results.successful, failed: results.failed };
  }

  async getStudentAttendance(studentId, user, courseId = null) {
    validateObjectId(studentId, "studentId");
    if (courseId) validateObjectId(courseId, "courseId");

    const student = await Student.findById(studentId);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    const userInfo = await User.findById(student.userId);
    if (!userInfo) {
      throw new AppError("User not found", 404);
    }

    // Get all attendance records for this student
    const query = { studentId };
    if (courseId) query.courseId = courseId;

    const attendances = await Attendance.find(query).sort({ createdAt: -1 });

    // Get schedule and course info for each attendance
    const attendanceHistory = await Promise.all(attendances.map(async (att) => {
      const schedule = await Schedule.findById(att.scheduleId);
      if (!schedule) return null;
      
      const course = await Course.findById(schedule.courseId);
      if (!course) return null;
      
      return {
        _id: att._id,
        schedule: {
          _id: schedule._id,
          sessionNumber: schedule.sessionNumber,
          title: schedule.title,
          date: schedule.date,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        },
        course: {
          _id: course._id,
          name: course.name,
          code: course.code,
          level: course.level,
        },
        status: att.status,
        notes: att.notes,
        recordedAt: att.recordedAt,
      };
    }));

    const filteredHistory = attendanceHistory.filter(a => a !== null);

    // Calculate statistics
    const stats = {
      total: filteredHistory.length,
      present: filteredHistory.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length,
      absent: filteredHistory.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length,
      late: filteredHistory.filter(a => a.status === ATTENDANCE_STATUS.LATE).length,
      excused: filteredHistory.filter(a => a.status === ATTENDANCE_STATUS.EXCUSED).length,
    };

    return {
      student: {
        _id: student._id,
        studentCode: student.studentCode,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        currentLevel: student.currentLevel,
        targetBand: student.targetBand
      },
      statistics: stats,
      attendanceHistory: filteredHistory
    };
  }
}

module.exports = new AttendanceService();

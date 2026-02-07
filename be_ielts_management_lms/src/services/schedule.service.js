// Schedule Service - MongoDB Driver
const Schedule = require("../models/schedule.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Teacher = require("../models/teacher.model");
const Attendance = require("../models/attendance.model");
const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { validateObjectId } = require("../utils/validation");
const { ENROLLMENT_STATUS, ATTENDANCE_STATUS, USER_ROLES } = require("../constants/enums");

class ScheduleService {
  computeScheduleStatus(schedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scheduleDate = new Date(schedule.date);
    scheduleDate.setHours(0, 0, 0, 0);

    if (schedule.isCancelled) return "cancelled";
    if (scheduleDate < today) return "past";
    if (scheduleDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  }

  async autoMarkAbsentForMissedSchedule(schedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scheduleDate = new Date(schedule.date);
    scheduleDate.setHours(0, 0, 0, 0);
    
    if (scheduleDate >= today) return;
    
    const existingAttendance = await Attendance.count({ scheduleId: schedule._id });
    if (existingAttendance > 0) return;
    
    const enrollments = await Enrollment.find({
      courseId: schedule.courseId,
      status: ENROLLMENT_STATUS.ACTIVE
    });
    
    if (enrollments.length === 0) return;
    
    // Create absent records
    for (const enrollment of enrollments) {
      await Attendance.create({
        scheduleId: schedule._id,
        studentId: enrollment.studentId,
        status: ATTENDANCE_STATUS.ABSENT,
        notes: "Auto-marked absent",
        recordedAt: new Date()
      });
    }
  }

  async generateSchedules(courseId, config, lang = "en") {
    const { weekDays, startTime, endTime, room } = config;

    validateObjectId(courseId, "courseId");

    if (!weekDays || !Array.isArray(weekDays) || weekDays.length === 0) {
      throw new AppError("Invalid weekDays", 400);
    }

    if (!startTime || !endTime) {
      throw new AppError("Invalid time", 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    if (!course.startDate || !course.endDate) {
      throw new AppError("Course has no date range", 400);
    }

    const existingSchedules = await Schedule.count({ courseId });
    if (existingSchedules > 0) {
      throw new AppError("Schedules already exist for this course", 409);
    }

    const schedules = [];
    const currentDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    let sessionNumber = 1;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (weekDays.includes(dayOfWeek)) {
        schedules.push({
          courseId,
          sessionNumber,
          title: `Session ${sessionNumber} - ${course.name}`,
          date: new Date(currentDate),
          startTime,
          endTime,
          room: room || course.room,
        });
        sessionNumber++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (schedules.length === 0) {
      throw new AppError("No schedules generated", 400);
    }

    for (const schedule of schedules) {
      await Schedule.create(schedule);
    }

    return { total: schedules.length, schedules };
  }

  async getSchedules(user, options = {}) {
    const { page = 1, limit = 50, courseId, computedStatus, fromDate, toDate } = options;
    const skip = (page - 1) * limit;

    const query = {};
    
    // Role-based filtering
    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError("Teacher profile not found", 404);
      }
      
      const courses = await Course.find({ teacherId: teacher._id.toString() });
      const courseIds = courses.map(c => c._id);
      
      query.$or = [
        { courseId: { $in: courseIds } },
        { substituteTeacherId: teacher._id.toString() }
      ];
    } else if (user.role === "student") {
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError("Student profile not found", 404);
      }
      
      const enrollments = await Enrollment.find({ studentId: student._id.toString() });
      const courseIds = enrollments.map(e => e.courseId);
      query.courseId = { $in: courseIds };
    }
    
    if (courseId) {
      query.courseId = courseId;
    }

    // Date filter
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const [schedules, total] = await Promise.all([
      Schedule.find(query).skip(skip).limit(parseInt(limit)),
      Schedule.count(query),
    ]);

    // Add computed data
    const schedulesWithData = await Promise.all(schedules.map(async (schedule) => {
      const scheduleObj = { ...schedule, computedStatus: this.computeScheduleStatus(schedule) };
      
      // Get course info
      const course = await Course.findById(schedule.courseId);
      if (course) {
        scheduleObj.courseId = {
          _id: course._id,
          name: course.name,
          code: course.code,
          level: course.level,
        };
      }
      
      // Get attendance summary
      const totalStudents = await Enrollment.count({
        courseId: schedule.courseId,
        status: ENROLLMENT_STATUS.ACTIVE
      });
      
      const attendances = await Attendance.find({ scheduleId: schedule._id });
      const presentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
      const absentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
      const lateCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
      
      scheduleObj.attendanceSummary = {
        totalStudents,
        recorded: attendances.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
      };

      return scheduleObj;
    }));

    return {
      schedules: schedulesWithData,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getScheduleById(scheduleId, user, lang = "en") {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    // Get course info
    const course = await Course.findById(schedule.courseId);
    if (course) {
      schedule.courseId = {
        _id: course._id,
        name: course.name,
        code: course.code,
        level: course.level,
      };
    }

    return schedule;
  }

  async updateSchedule(scheduleId, updateData, userContext, lang = "en") {
    const { userId, role } = userContext;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (role === "teacher") {
      const teacher = await Teacher.findOne({ userId });
      if (!teacher) {
        throw new AppError("Teacher not found", 404);
      }
    }

    await Schedule.updateById(scheduleId, updateData);
    return await this.getScheduleById(scheduleId, { role });
  }

  async deleteSchedule(scheduleId, lang = "en") {
    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    await Schedule.deleteById(scheduleId);
    return { message: "Schedule deleted" };
  }

  async deleteSchedulesByCourse(courseId, lang = "en") {
    const result = await Schedule.deleteMany({ courseId });
    return { deletedCount: result.deletedCount };
  }

  async getStudentSchedule(studentId, filters = {}) {
    const Student = require("../models/student.model");
    const enrollments = await Enrollment.find({ 
      studentId,
      status: "active"
    });

    if (!enrollments || enrollments.length === 0) {
      return { schedules: [], total: 0 };
    }

    const courseIds = enrollments.map(e => e.courseId);
    const query = { courseId: { $in: courseIds } };

    if (filters.courseId) {
      query.courseId = filters.courseId;
    }

    const schedules = await Schedule.find(query).sort({ date: 1, startTime: 1 });

    const schedulesWithAttendance = await Promise.all(schedules.map(async (schedule) => {
      const scheduleObj = { ...schedule, computedStatus: this.computeScheduleStatus(schedule) };
      
      const myAttendance = await Attendance.findOne({ 
        scheduleId: schedule._id,
        studentId 
      });

      if (myAttendance) {
        scheduleObj.myAttendance = {
          status: myAttendance.status,
          notes: myAttendance.notes,
          recordedAt: myAttendance.recordedAt
        };
      }

      return scheduleObj;
    }));

    return { schedules: schedulesWithAttendance, total: schedulesWithAttendance.length };
  }
}

module.exports = new ScheduleService();

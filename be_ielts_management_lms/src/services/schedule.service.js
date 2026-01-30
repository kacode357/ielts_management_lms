// Schedule Service - Business Logic Layer
const mongoose = require("mongoose");
const Schedule = require("../models/schedule.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Teacher = require("../models/teacher.model");
const Attendance = require("../models/attendance.model");
const Enrollment = require("../models/enrollment.model");
const User = require("../models/user.model");
const { AppError } = require("../utils/appError");
const { getMessages } = require("../responses");
const MESSAGES = require("../constants/messages");
const { validateObjectId, validateRequired } = require("../utils/validation");
const {
  ENROLLMENT_STATUS,
  ATTENDANCE_STATUS,
  ATTENDANCE_SUMMARY_STATUS,
  COMPUTED_SCHEDULE_STATUS,
  USER_ROLES
} = require("../constants/enums");

class ScheduleService {
  /**
   * Compute schedule status from date
   * @param {Object} schedule - Schedule object with date and isCancelled fields
   * @returns {string} computed status: past, today, upcoming, cancelled
   */
  computeScheduleStatus(schedule) {
    if (schedule.isCancelled) {
      return COMPUTED_SCHEDULE_STATUS.CANCELLED;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scheduleDate = new Date(schedule.date);
    scheduleDate.setHours(0, 0, 0, 0);

    if (scheduleDate < today) {
      return COMPUTED_SCHEDULE_STATUS.PAST;
    } else if (scheduleDate.getTime() === today.getTime()) {
      return COMPUTED_SCHEDULE_STATUS.TODAY;
    } else {
      return COMPUTED_SCHEDULE_STATUS.UPCOMING;
    }
  }

  /**
   * Auto-mark students as absent for schedules that passed without attendance
   * Logic: If schedule date is before today 00:00 and no attendance records exist,
   * automatically mark all enrolled students as "absent"
   * @param {Object} schedule - Schedule document
   */
  async autoMarkAbsentForMissedSchedule(schedule) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00 of today
    
    const scheduleDate = new Date(schedule.date);
    scheduleDate.setHours(0, 0, 0, 0);
    
    // Only process if schedule is in the past (before today)
    if (scheduleDate >= today) {
      return; // Schedule is today or in the future, don't auto-mark
    }
    
    // Check if any attendance records exist for this schedule
    const existingAttendance = await Attendance.countDocuments({ scheduleId: schedule._id });
    if (existingAttendance > 0) {
      return; // Already has attendance records, don't auto-mark
    }
    
    // Get all enrolled students for this course
    const enrollments = await Enrollment.find({
      courseId: schedule.courseId,
      status: ENROLLMENT_STATUS.ACTIVE
    }).select("studentId");
    
    if (enrollments.length === 0) {
      return; // No students enrolled
    }
    
    // Get system user for recordedBy (or use first admin)
    const systemUser = await User.findOne({ role: USER_ROLES.ADMIN }).select("_id");
    
    // Create absent records for all students
    const absentRecords = enrollments.map(enrollment => ({
      scheduleId: schedule._id,
      studentId: enrollment.studentId,
      status: ATTENDANCE_STATUS.ABSENT,
      notes: "Auto-marked absent - teacher did not take attendance",
      recordedBy: systemUser?._id,
      recordedAt: new Date()
    }));
    
    // Bulk insert all absent records
    await Attendance.insertMany(absentRecords, { ordered: false });

    // Note: Schedule status is now computed from date, no need to update
  }

  /**
   * Generate schedules automatically from course
   * @param {string} courseId - Course ID
   * @param {Object} config - Schedule configuration
   * @param {string} lang - Language preference
   * @returns {Promise<Array>} Created schedules
   */
  async generateSchedules(courseId, config, lang = "en") {
    const messages = getMessages(lang);
    const { weekDays, startTime, endTime, room } = config;

    // Validate courseId
    validateObjectId(courseId, "courseId");

    // Validate required fields
    if (!weekDays || !Array.isArray(weekDays) || weekDays.length === 0) {
      throw new AppError(MESSAGES.SCHEDULE.INVALID_WEEKDAYS, 400);
    }

    if (!startTime || !endTime) {
      throw new AppError(MESSAGES.SCHEDULE.INVALID_TIME, 400);
    }

    // Get course
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError(MESSAGES.COURSE.NOT_FOUND, 404);
    }

    if (!course.startDate || !course.endDate) {
      throw new AppError(MESSAGES.COURSE.INVALID_DATES, 400);
    }

    // Check if schedules already exist
    const existingSchedules = await Schedule.countDocuments({ courseId });
    if (existingSchedules > 0) {
      throw new AppError("Schedules already exist for this course. Delete them first or use update API.", 409);
    }

    // Generate schedule dates
    const schedules = [];
    const currentDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    let sessionNumber = 1;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ...

      // Check if current day is in weekDays
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

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (schedules.length === 0) {
      throw new AppError("No schedules generated. Check weekDays configuration.", 400);
    }

    // Bulk insert schedules
    const createdSchedules = await Schedule.insertMany(schedules);

    return {
      total: createdSchedules.length,
      schedules: createdSchedules,
    };
  }

  /**
   * Get schedules with filters
   * @param {Object} user - Current user (from req.user)
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Schedules list with pagination
   */
  async getSchedules(user, options = {}) {
    const { page = 1, limit = 50, courseId, computedStatus, fromDate, toDate, teacherId } = options;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    // Role-based filtering
    if (user.role === "teacher") {
      // Teacher: Only see schedules for courses they teach
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError(MESSAGES.ERROR.TEACHER_PROFILE_NOT_FOUND, 404);
      }
      
      // Find courses where teacher is main teacher
      const courses = await Course.find({ teacherId: teacher._id }).select("_id");
      const courseIds = courses.map(c => c._id);
      
      // Teacher sees schedules where they are main teacher OR substitute
      query.$or = [
        { courseId: { $in: courseIds } },
        { substituteTeacherId: teacher._id }
      ];
    } else if (user.role === "student") {
      // Student: Only see schedules for courses they are enrolled in
      const Student = require("../models/student.model");
      const Enrollment = require("../models/enrollment.model");
      
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError(MESSAGES.ERROR.STUDENT_PROFILE_NOT_FOUND, 404);
      }
      
      // Get enrolled courses
      const enrollments = await Enrollment.find({ studentId: student._id }).select("courseId");
      const courseIds = enrollments.map(e => e.courseId);
      
      query.courseId = { $in: courseIds };
    }
    // Admin: No additional filter, can see all schedules
    
    // Additional filters (applied on top of role-based filter)
    if (courseId) {
      // If role filter already has courseId conditions, merge them
      if (query.courseId) {
        // Student case: ensure courseId is in their enrolled courses
        query.courseId = courseId;
      } else if (query.$or) {
        // Teacher case: add courseId filter
        query.$or = query.$or.map(condition => ({ ...condition, courseId }));
      } else {
        // Admin case
        query.courseId = courseId;
      }
    }

    // Filter by computed status
    if (computedStatus) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (computedStatus) {
        case COMPUTED_SCHEDULE_STATUS.PAST:
          query.date = { ...query.date, $lt: today };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.TODAY:
          query.date = { ...query.date, $gte: today, $lt: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.UPCOMING:
          query.date = { ...query.date, $gte: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.CANCELLED:
          query.isCancelled = true;
          break;
      }
    }

    // Date range filter
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    // Execute query with pagination
    const [schedules, total] = await Promise.all([
      Schedule.find(query)
        .populate("courseId", "name code level")
        .populate("lessonId", "title type")
        .populate("substituteTeacherId", "teacherCode specialization")
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Schedule.countDocuments(query),
    ]);

    // Auto-mark absent for past schedules without attendance
    await Promise.all(schedules.map(schedule => 
      this.autoMarkAbsentForMissedSchedule(schedule)
    ));

    // Add attendance summary for each schedule
    const schedulesWithAttendance = await Promise.all(schedules.map(async (schedule) => {
      const scheduleObj = schedule.toObject();
      
      // Get total enrolled students for this course
      const totalStudents = await Enrollment.countDocuments({
        courseId: schedule.courseId._id,
        status: ENROLLMENT_STATUS.ACTIVE
      });
      
      // Get attendance records for this schedule
      const attendances = await Attendance.find({ scheduleId: schedule._id });
      
      // Calculate attendance summary
      const presentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
      const absentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
      const lateCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
      const excusedCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.EXCUSED).length;
      
      // Determine status based on time and attendance records
      let summaryStatus = ATTENDANCE_SUMMARY_STATUS.NOT_YET;
      
      // Check if schedule is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      const isPast = scheduleDate < today;
      
      if (attendances.length > 0) {
        // Has attendance records
        if (absentCount === attendances.length) {
          // All students are absent
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ABSENT;
        } else {
          // At least one student attended (present/late/excused)
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ATTENDED;
        }
      } else {
        // No attendance records
        if (isPast) {
          // Past schedule without records should show as absent (will be auto-marked)
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ABSENT;
        } else {
          // Current or future schedule
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.NOT_YET;
        }
      }
      
      const attendanceSummary = {
        totalStudents,
        recorded: attendances.length,
        notRecorded: totalStudents - attendances.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        status: summaryStatus,
        isAttendanceTaken: attendances.length > 0 // Teacher has taken attendance if there are any records
      };
      
      return {
        ...scheduleObj,
        computedStatus: this.computeScheduleStatus(schedule),
        attendanceSummary
      };
    }));

    return {
      schedules: schedulesWithAttendance,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @param {Object} user - Current user (from req.user)
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Schedule data
   */
  async getScheduleById(scheduleId, user, lang = "en") {
    const messages = getMessages(lang);

    const schedule = await Schedule.findById(scheduleId)
      .populate("courseId", "name code level teacherId")
      .populate("lessonId", "title type content")
      .populate("substituteTeacherId", "teacherCode specialization");

    if (!schedule) {
      throw new AppError(MESSAGES.SCHEDULE.NOT_FOUND, 404);
    }

    // Role-based access check
    if (user.role === "teacher") {
      // Teacher can only view schedules for courses they teach or substitute
      const teacher = await Teacher.findOne({ userId: user.userId });
      if (!teacher) {
        throw new AppError(MESSAGES.ERROR.TEACHER_PROFILE_NOT_FOUND, 404);
      }
      
      const isMainTeacher = schedule.courseId?.teacherId?.toString() === teacher._id.toString();
      const isSubstituteTeacher = schedule.substituteTeacherId?._id?.toString() === teacher._id.toString();
      
      if (!isMainTeacher && !isSubstituteTeacher) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    } else if (user.role === "student") {
      // Student can only view schedules for courses they are enrolled in
      const Student = require("../models/student.model");
      const Enrollment = require("../models/enrollment.model");
      
      const student = await Student.findOne({ userId: user.userId });
      if (!student) {
        throw new AppError(MESSAGES.ERROR.STUDENT_PROFILE_NOT_FOUND, 404);
      }
      
      const enrollment = await Enrollment.findOne({ 
        studentId: student._id, 
        courseId: schedule.courseId._id 
      });
      
      if (!enrollment) {
        throw new AppError(MESSAGES.ERROR.FORBIDDEN, 403);
      }
    }
    // Admin can view any schedule

    // Populate main teacher from course
    if (schedule.courseId?.teacherId) {
      await schedule.populate("courseId.teacherId", "teacherCode specialization");
    }

    return schedule;
  }

  /**
   * Update schedule (for manual adjustments)
   * @param {string} scheduleId - Schedule ID
   * @param {Object} updateData - Data to update
   * @param {Object} userContext - User context {userId, role}
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Updated schedule
   */
  async updateSchedule(scheduleId, updateData, userContext, lang = "en") {
    const messages = getMessages(lang);
    const { userId, role } = userContext;

    // Check if schedule exists
    const schedule = await Schedule.findById(scheduleId).populate("courseId", "teacherId");
    if (!schedule) {
      throw new AppError(MESSAGES.SCHEDULE.NOT_FOUND, 404);
    }

    // Authorization check for teachers
    if (role === "teacher") {
      // Find teacher profile by userId
      const teacher = await Teacher.findOne({ userId });
      if (!teacher) {
        throw new AppError(MESSAGES.COURSE.TEACHER_NOT_FOUND, 404);
      }

      // Check if teacher is the main teacher OR substitute teacher
      const isMainTeacher = schedule.courseId?.teacherId?.toString() === teacher._id.toString();
      const isSubstituteTeacher = schedule.substituteTeacherId?.toString() === teacher._id.toString();

      if (!isMainTeacher && !isSubstituteTeacher) {
        throw new AppError(MESSAGES.SCHEDULE.TEACHER_PERMISSION_DENIED, 403);
      }
    }

    // Validate substitute teacher if provided
    if (updateData.substituteTeacherId) {
      validateObjectId(updateData.substituteTeacherId, "substituteTeacherId");
      const teacher = await Teacher.findById(updateData.substituteTeacherId);
      if (!teacher) {
        throw new AppError(MESSAGES.SCHEDULE.SUBSTITUTE_TEACHER_NOT_FOUND, 404);
      }
    }

    // Validate lesson if provided
    if (updateData.lessonId) {
      validateObjectId(updateData.lessonId, "lessonId");
      const lesson = await Lesson.findById(updateData.lessonId);
      if (!lesson) {
        throw new AppError(MESSAGES.SCHEDULE.LESSON_NOT_FOUND, 404);
      }
    }

    // Update schedule
    Object.assign(schedule, updateData);
    await schedule.save();

    // Populate references
    await schedule.populate([
      { path: "courseId", select: "name code level" },
      { path: "lessonId", select: "title type" },
      { path: "substituteTeacherId", select: "teacherCode specialization" },
    ]);

    return schedule;
  }

  /**
   * Delete schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Deleted schedule
   */
  async deleteSchedule(scheduleId, lang = "en") {
    const messages = getMessages(lang);

    const schedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!schedule) {
      throw new AppError(MESSAGES.SCHEDULE.NOT_FOUND, 404);
    }

    return schedule;
  }

  /**
   * Bulk delete schedules by course
   * @param {string} courseId - Course ID
   * @param {string} lang - Language preference
   * @returns {Promise<Object>} Delete result
   */
  async deleteSchedulesByCourse(courseId, lang = "en") {
    const messages = getMessages(lang);

    const result = await Schedule.deleteMany({ courseId });

    return {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} schedules`,
    };
  }

  /**
   * Get teacher's schedule (for teacher view)
   * @param {string} teacherId - Teacher ID
   * @param {Object} options - Filter options
   * @returns {Promise<Object>} Teacher's schedules
   */
  async getTeacherSchedule(teacherId, options = {}) {
    const { fromDate, toDate, computedStatus, courseId } = options;

    // Find courses where teacher is main teacher
    const courses = await Course.find({ teacherId, isActive: true }).select("_id");
    const courseIds = courses.map(c => c._id);

    // Build query
    const query = {
      $or: [
        { courseId: { $in: courseIds } },
        { substituteTeacherId: teacherId }
      ]
    };

    // Filter by specific course if provided
    if (courseId) {
      // Verify teacher has access to this course
      const hasAccess = courseIds.some(id => id.toString() === courseId);
      if (!hasAccess) {
        // Check if teacher is substitute
        const isSubstitute = await Schedule.findOne({ 
          courseId, 
          substituteTeacherId: teacherId 
        });
        if (!isSubstitute) {
          throw new AppError("You don't have access to this course's schedules", 403);
        }
      }
      query.courseId = courseId;
      delete query.$or; // Remove $or when filtering by specific course
    }

    // Filter by computed status
    if (computedStatus) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (computedStatus) {
        case COMPUTED_SCHEDULE_STATUS.PAST:
          query.date = { ...query.date, $lt: today };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.TODAY:
          query.date = { ...query.date, $gte: today, $lt: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.UPCOMING:
          query.date = { ...query.date, $gte: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.CANCELLED:
          query.isCancelled = true;
          break;
      }
    }

    // Date range filter
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const schedules = await Schedule.find(query)
      .populate("courseId", "name code level")
      .populate("lessonId", "title type")
      .populate("substituteTeacherId", "teacherCode")
      .sort({ date: 1, startTime: 1 });

    // Auto-mark absent for past schedules without attendance
    await Promise.all(schedules.map(schedule => 
      this.autoMarkAbsentForMissedSchedule(schedule)
    ));

    // Add attendance summary for each schedule
    const schedulesWithAttendance = await Promise.all(schedules.map(async (schedule) => {
      const scheduleObj = schedule.toObject();
      
      // Get total enrolled students for this course
      const totalStudents = await Enrollment.countDocuments({
        courseId: schedule.courseId._id,
        status: ENROLLMENT_STATUS.ACTIVE
      });
      
      // Get attendance records for this schedule
      const attendances = await Attendance.find({ scheduleId: schedule._id });
      
      // Calculate attendance summary
      const presentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
      const absentCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
      const lateCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
      const excusedCount = attendances.filter(a => a.status === ATTENDANCE_STATUS.EXCUSED).length;
      
      // Determine status based on time and attendance records
      let summaryStatus = ATTENDANCE_SUMMARY_STATUS.NOT_YET;
      
      // Check if schedule is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scheduleDate = new Date(schedule.date);
      scheduleDate.setHours(0, 0, 0, 0);
      const isPast = scheduleDate < today;
      
      if (attendances.length > 0) {
        // Has attendance records
        if (absentCount === attendances.length) {
          // All students are absent
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ABSENT;
        } else {
          // At least one student attended (present/late/excused)
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ATTENDED;
        }
      } else {
        // No attendance records
        if (isPast) {
          // Past schedule without records should show as absent (will be auto-marked)
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ABSENT;
        } else {
          // Current or future schedule
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.NOT_YET;
        }
      }
      
      const attendanceSummary = {
        totalStudents,
        recorded: attendances.length,
        notRecorded: totalStudents - attendances.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        status: summaryStatus,
        isAttendanceTaken: attendances.length > 0 // Teacher has taken attendance if there are any records
      };
      
      return {
        ...scheduleObj,
        computedStatus: this.computeScheduleStatus(schedule),
        attendanceSummary
      };
    }));

    return { schedules: schedulesWithAttendance, total: schedulesWithAttendance.length };
  }

  /**
   * Update attendance record for a schedule
   * @param {string} scheduleId - Schedule ID
   * @param {string} attendanceId - Attendance ID to update
   * @param {Object} updateData - { status, notes }
   * @param {string} userId - User ID making the update (for authorization)
   * @returns {Promise<Object>} Updated attendance
   */
  async updateAttendance(scheduleId, attendanceId, updateData, userId) {
    // Verify schedule exists and user is the teacher
    const schedule = await Schedule.findById(scheduleId).populate("courseId");
    if (!schedule) {
      throw new AppError(404, "Schedule not found");
    }

    // Check if user is the teacher of this course
    if (schedule.courseId.teacherId.toString() !== userId) {
      throw new AppError(403, "You can only update attendance for your own courses");
    }

    // Only allow editing attendance on the same day as the schedule
    const scheduleDate = new Date(schedule.date);
    const today = new Date();
    scheduleDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (scheduleDate.getTime() !== today.getTime()) {
      throw new AppError(403, "You can only edit attendance on the same day as the schedule");
    }

    // Find and update the attendance record
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      scheduleId: scheduleId
    });

    if (!attendance) {
      throw new AppError(404, "Attendance record not found");
    }

    // Update fields
    if (updateData.status && [ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.ABSENT, ATTENDANCE_STATUS.LATE, ATTENDANCE_STATUS.EXCUSED].includes(updateData.status)) {
      attendance.status = updateData.status;
    }

    if (updateData.notes !== undefined) {
      attendance.notes = updateData.notes;
    }

    attendance.recordedBy = userId;
    attendance.recordedAt = new Date();

    await attendance.save();

    // Populate student info
    await attendance.populate("studentId", "firstName lastName studentCode email");

    return attendance;
  }

  /**
   * Bulk update attendances for a schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Array} attendances - Array of { studentId, status, notes }
   * @param {string} userId - User ID making the update
   * @returns {Promise<Object>} Updated attendances
   */
  async bulkUpdateAttendances(scheduleId, attendances, userId) {
    // Verify schedule exists and user is the teacher
    const schedule = await Schedule.findById(scheduleId).populate("courseId");
    if (!schedule) {
      throw new AppError(404, "Schedule not found");
    }

    // Check if user is the teacher of this course
    if (schedule.courseId.teacherId.toString() !== userId) {
      throw new AppError(403, "You can only update attendance for your own courses");
    }

    // Only allow editing attendance on the same day as the schedule
    const scheduleDate = new Date(schedule.date);
    const today = new Date();
    scheduleDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (scheduleDate.getTime() !== today.getTime()) {
      throw new AppError(403, "You can only edit attendance on the same day as the schedule");
    }

    const updatedRecords = [];
    const errors = [];

    for (const item of attendances) {
      try {
        // Find existing attendance record
        let attendance = await Attendance.findOne({
          scheduleId: scheduleId,
          studentId: item.studentId
        });

        if (!attendance) {
          // Create new attendance record if not exists
          attendance = new Attendance({
            scheduleId: scheduleId,
            studentId: item.studentId,
            status: item.status || ATTENDANCE_STATUS.PRESENT,
            notes: item.notes || "",
            recordedBy: userId,
            recordedAt: new Date()
          });
        } else {
          // Update existing record
          if (item.status) {
            attendance.status = item.status;
          }
          if (item.notes !== undefined) {
            attendance.notes = item.notes;
          }
          attendance.recordedBy = userId;
          attendance.recordedAt = new Date();
        }

        await attendance.save();
        await attendance.populate("studentId", "firstName lastName studentCode email");
        updatedRecords.push(attendance);
      } catch (error) {
        errors.push({
          studentId: item.studentId,
          error: error.message
        });
      }
    }

    return {
      success: updatedRecords,
      errors: errors,
      total: updatedRecords.length,
      failed: errors.length
    };
  }

  /**
   * Get student's own schedule from their enrolled courses
   * @param {string} studentId - Student ID
   * @param {Object} filters - { courseId, fromDate, toDate, status }
   * @returns {Promise<Object>} { schedules, total }
   */
  async getStudentSchedule(studentId, filters = {}) {
    const Enrollment = require("../models/enrollment.model");

    // Get all courses the student is enrolled in
    const enrollments = await Enrollment.find({ 
      studentId: studentId,
      status: "active"
    }).select("courseId");

    if (!enrollments || enrollments.length === 0) {
      return { schedules: [], total: 0 };
    }

    const courseIds = enrollments.map(e => e.courseId);

    // Build query
    const query = { courseId: { $in: courseIds } };

    // Apply filters
    if (filters.courseId) {
      // Check if student is enrolled in this course
      if (!courseIds.some(id => id.toString() === filters.courseId)) {
        throw new AppError(403, "You are not enrolled in this course");
      }
      query.courseId = filters.courseId;
    }

    if (filters.fromDate || filters.toDate) {
      query.date = {};
      if (filters.fromDate) {
        query.date.$gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    // Filter by computed status (based on date)
    if (filters.computedStatus) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (filters.computedStatus) {
        case COMPUTED_SCHEDULE_STATUS.PAST:
          query.date = { ...query.date, $lt: today };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.TODAY:
          query.date = { ...query.date, $gte: today, $lt: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.UPCOMING:
          query.date = { ...query.date, $gte: tomorrow };
          query.isCancelled = { $ne: true };
          break;
        case COMPUTED_SCHEDULE_STATUS.CANCELLED:
          query.isCancelled = true;
          break;
      }
    }

    // Get schedules
    const schedules = await Schedule.find(query)
      .populate({
        path: "courseId",
        select: "courseName courseCode level startDate endDate"
      })
      .populate({
        path: "lessonId",
        select: "title description order type"
      })
      .sort({ date: 1, startTime: 1 });

    // Auto-mark absent for past schedules without attendance
    await Promise.all(schedules.map(schedule => 
      this.autoMarkAbsentForMissedSchedule(schedule)
    ));

    // Add attendance summary for each schedule - show student's own attendance
    const schedulesWithAttendance = await Promise.all(schedules.map(async (schedule) => {
      const scheduleObj = schedule.toObject();

      // Calculate total enrolled students
      const totalStudents = await Enrollment.countDocuments({
        courseId: schedule.courseId._id,
        status: "active"
      });

      // Get ALL attendance records for summary
      const allAttendances = await Attendance.find({ scheduleId: schedule._id });

      // Calculate attendance summary for all students
      const presentCount = allAttendances.filter(a => a.status === ATTENDANCE_STATUS.PRESENT).length;
      const absentCount = allAttendances.filter(a => a.status === ATTENDANCE_STATUS.ABSENT).length;
      const lateCount = allAttendances.filter(a => a.status === ATTENDANCE_STATUS.LATE).length;
      const excusedCount = allAttendances.filter(a => a.status === ATTENDANCE_STATUS.EXCUSED).length;

      let summaryStatus = ATTENDANCE_SUMMARY_STATUS.NOT_YET;
      if (allAttendances.length > 0) {
        if (presentCount === totalStudents) {
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.FULL;
        } else if (absentCount === totalStudents) {
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.ABSENT;
        } else {
          summaryStatus = ATTENDANCE_SUMMARY_STATUS.PARTIAL;
        }
      }

      const attendanceSummary = {
        totalStudents,
        recorded: allAttendances.length,
        notRecorded: totalStudents - allAttendances.length,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        status: summaryStatus,
        isAttendanceTaken: allAttendances.length > 0
      };

      // Get student's own attendance for this schedule
      const myAttendance = await Attendance.findOne({ 
        scheduleId: schedule._id,
        studentId: studentId
      });

      return {
        ...scheduleObj,
        computedStatus: this.computeScheduleStatus(schedule),
        attendanceSummary,
        myAttendance: myAttendance ? {
          status: myAttendance.status,
          notes: myAttendance.notes,
          recordedAt: myAttendance.recordedAt
        } : null
      };
    }));

    return { schedules: schedulesWithAttendance, total: schedulesWithAttendance.length };
  }}

module.exports = new ScheduleService();
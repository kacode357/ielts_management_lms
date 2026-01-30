// Schedule Controller - Request/Response Handler
const scheduleService = require("../services/schedule.service");
const { sendSuccess } = require("../utils/response");
const { getMessages } = require("../responses");

/**
 * @swagger
 * /api/schedules/generate:
 *   post:
 *     tags: [Schedules]
 *     summary: Generate schedules automatically for a course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId, weekDays, startTime, endTime]
 *             properties:
 *               courseId: { type: string, example: "60d5f9b5e1b3c72d8c8b4567" }
 *               weekDays: { type: array, items: { type: integer }, example: [1, 3, 5], description: "0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat" }
 *               startTime: { type: string, example: "19:00" }
 *               endTime: { type: string, example: "21:00" }
 *               room: { type: string, example: "Room A1" }
 *     responses:
 *       201:
 *         description: Schedules generated successfully
 */
exports.generateSchedules = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const { courseId, ...config } = req.body;
    
    const result = await scheduleService.generateSchedules(courseId, config, lang);
    
    sendSuccess(res, result, 201, messages.SCHEDULE.GENERATED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     tags: [Schedules]
 *     summary: Get schedules with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: computedStatus
 *         schema:
 *           type: string
 *           enum: [past, today, upcoming, cancelled]
 *         description: Filter by computed status (based on date)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of schedules
 */
exports.getSchedules = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await scheduleService.getSchedules(req.user, req.query);
    
    sendSuccess(res, result, 200, messages.SCHEDULE.LIST_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     tags: [Schedules]
 *     summary: Get schedule by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule details
 */
exports.getScheduleById = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const schedule = await scheduleService.getScheduleById(req.params.id, req.user, lang);
    
    sendSuccess(res, { schedule }, 200, messages.SCHEDULE.DETAIL_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     tags: [Schedules]
 *     summary: Update schedule (manual adjustment)
 *     description: |
 *       **Authorization:**
 *       - Admin/Academic Staff: Can update any schedule
 *       - Teacher: Can only update schedules for courses they teach (original or substitute)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date: { type: string, format: date, example: "2024-02-15" }
 *               startTime: { type: string, example: "19:00" }
 *               endTime: { type: string, example: "21:00" }
 *               room: { type: string, example: "Room B2" }
 *               isCancelled: { type: boolean, example: false, description: "Cancel this schedule (exceptional case)" }
 *               cancellationReason: { type: string, example: "Teacher is sick", description: "Reason for cancellation" }
 *               lessonId: { type: string, example: "60d5f9b5e1b3c72d8c8b4777", description: "Optional - Lesson ObjectId" }
 *               substituteTeacherId: { type: string, example: "60d5f9b5e1b3c72d8c8b4888", description: "Optional - Teacher ObjectId" }
 *               internalNotes: { type: string, example: "Teacher substitution due to sick leave" }
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       403:
 *         description: Teacher can only update their own schedules
 */
exports.updateSchedule = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    const schedule = await scheduleService.updateSchedule(
      req.params.id, 
      req.body, 
      { userId, role: userRole },
      lang
    );
    
    sendSuccess(res, { schedule }, 200, messages.SCHEDULE.UPDATED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     tags: [Schedules]
 *     summary: Delete schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 */
exports.deleteSchedule = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const schedule = await scheduleService.deleteSchedule(req.params.id, lang);
    
    sendSuccess(res, { schedule }, 200, messages.SCHEDULE.DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/course/{courseId}:
 *   delete:
 *     tags: [Schedules]
 *     summary: Delete all schedules for a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedules deleted successfully
 */
exports.deleteSchedulesByCourse = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await scheduleService.deleteSchedulesByCourse(req.params.courseId, lang);
    
    sendSuccess(res, result, 200, messages.SCHEDULE.BULK_DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/teacher/my-schedule:
 *   get:
 *     tags: [Schedules]
 *     summary: Get teacher's own schedule
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by specific course ID
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: computedStatus
 *         schema:
 *           type: string
 *           enum: [past, today, upcoming, cancelled]
 *         description: Filter by computed status (based on date)
 *     responses:
 *       200:
 *         description: Teacher's schedule
 */
exports.getMySchedule = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    
    // Get teacherId from userId
    const Teacher = require("../models/teacher.model");
    const teacher = await Teacher.findOne({ userId: req.user.userId });
    
    if (!teacher) {
      const { AppError } = require("../utils/appError");
      throw new AppError("Teacher profile not found", 404);
    }
    
    const result = await scheduleService.getTeacherSchedule(teacher._id, req.query);
    
    sendSuccess(res, result, 200, messages.SCHEDULE.TEACHER_SCHEDULE_SUCCESS);
  } catch (error) {
    next(error);
  }
};
/**
 * @swagger
 * /api/schedules/{scheduleId}/attendances/{attendanceId}:
 *   put:
 *     tags: [Schedules]
 *     summary: Update a single attendance record (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: attendanceId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [present, absent, late, excused] }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 */
exports.updateAttendance = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const { scheduleId, attendanceId } = req.params;
    const updateData = req.body;
    
    const result = await scheduleService.updateAttendance(
      scheduleId,
      attendanceId,
      updateData,
      req.user.userId
    );
    
    sendSuccess(res, result, 200, messages.SCHEDULE.ATTENDANCE_UPDATED || "Attendance updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/{scheduleId}/attendances:
 *   put:
 *     tags: [Schedules]
 *     summary: Bulk update attendances for a schedule (Teacher only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attendances]
 *             properties:
 *               attendances:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [studentId, status]
 *                   properties:
 *                     studentId: { type: string }
 *                     status: { type: string, enum: [present, absent, late, excused] }
 *                     notes: { type: string }
 *     responses:
 *       200:
 *         description: Attendances updated successfully
 */
exports.bulkUpdateAttendances = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const { scheduleId } = req.params;
    const { attendances } = req.body;
    
    if (!attendances || !Array.isArray(attendances)) {
      const { AppError } = require("../utils/appError");
      throw new AppError(400, "Attendances array is required");
    }
    
    const result = await scheduleService.bulkUpdateAttendances(
      scheduleId,
      attendances,
      req.user.userId
    );
    
    sendSuccess(res, result, 200, messages.SCHEDULE.ATTENDANCES_UPDATED || "Attendances updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/schedules/student/my-schedule:
 *   get:
 *     tags: [Schedules]
 *     summary: Get student's own schedule from enrolled courses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema: { type: string }
 *         description: Filter by specific course ID
 *       - in: query
 *         name: fromDate
 *         schema: { type: string, format: date }
 *         description: Filter schedules from this date
 *       - in: query
 *         name: toDate
 *         schema: { type: string, format: date }
 *         description: Filter schedules to this date
 *       - in: query
 *         name: computedStatus
 *         schema: { type: string, enum: [past, today, upcoming, cancelled] }
 *         description: Filter by computed status (based on date)
 *     responses:
 *       200:
 *         description: Student's schedule retrieved successfully
 */
exports.getMyScheduleAsStudent = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    
    // Get studentId from userId
    const Student = require("../models/student.model");
    const student = await Student.findOne({ userId: req.user.userId });
    
    if (!student) {
      const { AppError } = require("../utils/appError");
      throw new AppError("Student profile not found", 404);
    }
    
    const result = await scheduleService.getStudentSchedule(student._id, req.query);
    
    sendSuccess(res, result, 200, messages.SCHEDULE.STUDENT_SCHEDULE_SUCCESS || "Student schedule retrieved successfully");
  } catch (error) {
    next(error);
  }
};

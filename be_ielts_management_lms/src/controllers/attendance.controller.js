// Attendance Controller - Handle HTTP Requests
const attendanceService = require("../services/attendance.service");
const { sendSuccess } = require("../utils/response");
const { getMessages } = require("../responses");
const MESSAGES = require("../constants/messages");

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management APIs
 */

/**
 * @swagger
 * /api/attendance/schedule/{scheduleId}:
 *   get:
 *     tags: [Attendance]
 *     summary: Get attendance list for a schedule (Teacher/Admin)
 *     description: |
 *       Get list of students and their attendance status for a specific schedule
 *       **Authorization:**
 *       - Admin: Can view all
 *       - Teacher: Can only view if they are the main teacher or substitute teacher
 *       
 *       **Business Logic:**
 *       - Validates teacher has permission (main teacher OR substitute teacher)
 *       - Merges enrolled students with existing attendance records
 *       - Returns null status if not yet marked, otherwise returns saved status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Attendance list retrieved successfully
 *       403:
 *         description: No permission to access this schedule
 *       404:
 *         description: Schedule not found
 */
exports.getAttendanceForSchedule = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await attendanceService.getAttendanceForSchedule(
      req.params.scheduleId,
      req.user
    );
    
    sendSuccess(res, result, 200, "Attendance list retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attendance/schedule/{scheduleId}:
 *   post:
 *     tags: [Attendance]
 *     summary: Record/Update attendance (Teacher/Admin)
 *     description: |
 *       Record or update attendance for students in a schedule (Upsert operation)
 *       **Authorization:**
 *       - Admin: Can record for all
 *       - Teacher: Can only record if they are the main teacher or substitute teacher
 *       
 *       **Business Logic:**
 *       - Uses UPSERT: If record exists, updates it; otherwise creates new
 *       - Automatically sets recordedBy to current user (for salary/KPI calculation)
 *       - Can be called multiple times to update attendance
 *       - Optionally updates schedule status to 'completed'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendanceList
 *             properties:
 *               attendanceList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - studentId
 *                     - status
 *                   properties:
 *                     studentId:
 *                       type: string
 *                       description: Student ID
 *                     status:
 *                       type: string
 *                       enum: [present, absent, late, excused]
 *                       description: Attendance status
 *                     notes:
 *                       type: string
 *                       description: Optional notes
 *               markScheduleCompleted:
 *                 type: boolean
 *                 default: true
 *                 description: Whether to mark schedule as completed
 *     responses:
 *       200:
 *         description: Attendance recorded successfully
 *       403:
 *         description: No permission to record for this schedule
 *       404:
 *         description: Schedule not found
 */
exports.recordAttendance = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await attendanceService.recordAttendance(
      req.params.scheduleId,
      req.body.attendanceList,
      req.user,
      req.body.markScheduleCompleted
    );
    
    sendSuccess(res, result, 200, "Attendance recorded successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attendance/student/{studentId}:
 *   get:
 *     tags: [Attendance]
 *     summary: Get student attendance history
 *     description: |
 *       Get attendance history for a specific student
 *       **Authorization:**
 *       - Admin: Can view all students
 *       - Teacher: Can view students in their courses
 *       - Student: Can only view their own attendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *     responses:
 *       200:
 *         description: Attendance history retrieved successfully
 *       403:
 *         description: No permission
 *       404:
 *         description: Student not found
 */
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await attendanceService.getStudentAttendance(
      req.params.studentId,
      req.user,
      req.query.courseId
    );
    
    sendSuccess(res, result, 200, "Attendance history retrieved successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = exports;

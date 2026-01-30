// Schedule Routes
const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/schedule.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

/**
 * Authorization Matrix:
 * 
 * Action                    | Admin | Teacher | Student
 * --------------------------|-------|---------|--------
 * Generate Schedules        |   ✓   |    ✗    |   ✗
 * View All Schedules        |   ✓   |    ✓    |   ✓
 * View Teacher Schedule     |   ✓   |    ✓    |   ✗
 * View Student Schedule     |   ✓   |    ✗    |   ✓
 * View Schedule by ID       |   ✓   |    ✓    |   ✓
 * Update Schedule           |   ✓   |    ✓*   |   ✗
 * Update Attendance         |   ✓   |    ✓*   |   ✗
 * Bulk Update Attendances   |   ✓   |    ✓*   |   ✗
 * Delete Schedule           |   ✓   |    ✗    |   ✗
 * Delete All (Course)       |   ✓   |    ✗    |   ✗
 * 
 * * Teacher can only update schedules for courses they teach
 */

// All routes require authentication
router.use(auth);

// === WRITE OPERATIONS (Create) ===

// Generate schedules for a course (admin only)
router.post(
  "/generate",
  authorizeRoles("admin"),
  scheduleController.generateSchedules
);

// === READ OPERATIONS ===

// Get teacher's own schedule (teacher only - must be before /:id route)
router.get(
  "/teacher/my-schedule",
  authorizeRoles("teacher"),
  scheduleController.getMySchedule
);

// Get student's own schedule (student only - must be before /:id route)
router.get(
  "/student/my-schedule",
  authorizeRoles("student"),
  scheduleController.getMyScheduleAsStudent
);

// Get all schedules with filters (all authenticated users)
router.get("/", scheduleController.getSchedules);

// Get schedule by ID (all authenticated users)
router.get("/:id", scheduleController.getScheduleById);

// === UPDATE OPERATIONS ===

// Update single attendance (teacher only - must be before /:id route)
router.put(
  "/:scheduleId/attendances/:attendanceId",
  authorizeRoles("admin", "teacher"),
  scheduleController.updateAttendance
);

// Bulk update attendances (teacher only - must be before /:id route)
router.put(
  "/:scheduleId/attendances",
  authorizeRoles("admin", "teacher"),
  scheduleController.bulkUpdateAttendances
);

// Update schedule (admin, teacher for their own courses)
// Note: Teacher permission check is done in controller level
router.put(
  "/:id",
  authorizeRoles("admin", "teacher"),
  scheduleController.updateSchedule
);

// === DELETE OPERATIONS ===

// Delete all schedules for a course (admin only - most destructive)
router.delete(
  "/course/:courseId",
  authorizeRoles("admin"),
  scheduleController.deleteSchedulesByCourse
);

// Delete single schedule (admin only)
router.delete(
  "/:id",
  authorizeRoles("admin"),
  scheduleController.deleteSchedule
);

module.exports = router;

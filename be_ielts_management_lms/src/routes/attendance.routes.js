// Attendance Routes
const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

/**
 * Authorization Matrix:
 * - admin: Full access
 * - teacher: Can view and record attendance for their own classes (including substitute)
 * - student: Can view their own attendance
 */

// All routes require authentication
router.use(auth);

// Get attendance list for a schedule (for teacher to take attendance)
// Teacher (main or substitute) and admin can access
router.get(
  "/schedule/:scheduleId",
  authorizeRoles("admin", "teacher"),
  attendanceController.getAttendanceForSchedule
);

// Record/Update attendance (Upsert)
// Teacher (main or substitute) and admin can record
router.post(
  "/schedule/:scheduleId",
  authorizeRoles("admin", "teacher"),
  attendanceController.recordAttendance
);

// Get student's attendance history
// Student can view their own, teacher can view their students, admin can view all
router.get(
  "/student/:studentId",
  attendanceController.getStudentAttendance
);

module.exports = router;

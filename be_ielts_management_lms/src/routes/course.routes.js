// Course Routes
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

/**
 * Authorization Matrix:
 * - admin: Full access (CRUD)
 * - teacher: Read only
 * - student: Read only
 */

// All routes require authentication
router.use(auth);

// Create course (admin only)
router.post(
  "/",
  authorizeRoles("admin"),
  courseController.createCourse
);

// Get all courses (all authenticated users can view)
router.get("/", courseController.getCourses);

// Get course by ID (all authenticated users can view)
router.get("/:id", courseController.getCourseById);

// Get course members/students (all authenticated users can view)
router.get("/:id/members", courseController.getCourseMembers);

// Add student to course (admin only)
router.post(
  "/:id/enroll",
  authorizeRoles("admin"),
  courseController.enrollStudent
);

// Assign/change teacher for course (admin only)
router.put(
  "/:id/teacher",
  authorizeRoles("admin"),
  courseController.assignTeacher
);

// Update course (admin only)
router.put(
  "/:id",
  authorizeRoles("admin"),
  courseController.updateCourse
);

// Delete course (admin only)
router.delete(
  "/:id",
  authorizeRoles("admin"),
  courseController.deleteCourse
);

module.exports = router;

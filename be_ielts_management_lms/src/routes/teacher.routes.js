// Teacher Routes
const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

/**
 * Authorization Matrix:
 * - admin: Full access (CRUD)
 * - teacher: Read only (all teachers list + own profile)
 * - student: Read only (all teachers list)
 */

// All routes require authentication
router.use(auth);

// === READ OPERATIONS ===

// Get all teachers (all authenticated users)
router.get("/", teacherController.getTeachers);

// Get teacher by ID (all authenticated users)
router.get("/:id", teacherController.getTeacherById);

// === WRITE OPERATIONS (Admin only) ===

// Create teacher (admin only)
router.post(
  "/",
  authorizeRoles("admin"),
  teacherController.createTeacher
);

// Update teacher (admin only)
router.put(
  "/:id",
  authorizeRoles("admin"),
  teacherController.updateTeacher
);

// Delete teacher (admin only)
router.delete(
  "/:id",
  authorizeRoles("admin"),
  teacherController.deleteTeacher
);

module.exports = router;

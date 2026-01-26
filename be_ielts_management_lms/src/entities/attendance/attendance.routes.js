// Attendance Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const attendanceController = {
  getAll: (req, res) => res.json({ message: "Get all attendance records" }),
  getById: (req, res) => res.json({ message: "Get attendance by ID" }),
  create: (req, res) => res.json({ message: "Create attendance record" }),
  update: (req, res) => res.json({ message: "Update attendance" }),
  delete: (req, res) => res.json({ message: "Delete attendance" }),
  getClassAttendance: (req, res) => res.json({ message: "Get attendance for class" }),
};

router.get("/", auth, authorizeRoles("admin", "teacher"), attendanceController.getAll);
router.get("/:id", auth, attendanceController.getById);
router.post("/", auth, authorizeRoles("admin", "teacher"), attendanceController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), attendanceController.update);
router.delete("/:id", auth, authorizeRoles("admin", "teacher"), attendanceController.delete);
router.get("/class/:classId", auth, attendanceController.getClassAttendance);

module.exports = router;

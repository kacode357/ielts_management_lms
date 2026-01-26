// Dashboard Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const dashboardController = {
  getAdminStats: (req, res) => res.json({ message: "Get admin dashboard stats" }),
  getTeacherStats: (req, res) => res.json({ message: "Get teacher dashboard stats" }),
  getStudentStats: (req, res) => res.json({ message: "Get student dashboard stats" }),
};

router.get("/admin", auth, authorizeRoles("admin"), dashboardController.getAdminStats);
router.get("/teacher", auth, authorizeRoles("teacher"), dashboardController.getTeacherStats);
router.get("/student", auth, authorizeRoles("student"), dashboardController.getStudentStats);

module.exports = router;

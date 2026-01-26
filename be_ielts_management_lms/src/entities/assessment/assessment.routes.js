// Assessment Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const assessmentController = {
  getAll: (req, res) => res.json({ message: "Get all assessments" }),
  getById: (req, res) => res.json({ message: "Get assessment by ID" }),
  create: (req, res) => res.json({ message: "Create assessment" }),
  update: (req, res) => res.json({ message: "Update assessment" }),
  delete: (req, res) => res.json({ message: "Delete assessment" }),
  getStudentAssessments: (req, res) => res.json({ message: "Get assessments for student" }),
};

router.get("/", auth, assessmentController.getAll);
router.get("/:id", auth, assessmentController.getById);
router.post("/", auth, authorizeRoles("admin", "teacher"), assessmentController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), assessmentController.update);
router.delete("/:id", auth, authorizeRoles("admin", "teacher"), assessmentController.delete);
router.get("/student/:studentId", auth, assessmentController.getStudentAssessments);

module.exports = router;

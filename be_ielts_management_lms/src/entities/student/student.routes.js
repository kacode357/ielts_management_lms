// Student Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

// Placeholder controller - will be implemented
const studentController = {
  getAll: (req, res) => res.json({ message: "Get all students" }),
  getById: (req, res) => res.json({ message: "Get student by ID" }),
  create: (req, res) => res.json({ message: "Create student" }),
  update: (req, res) => res.json({ message: "Update student" }),
  delete: (req, res) => res.json({ message: "Delete student" }),
};

router.get("/", auth, studentController.getAll);
router.get("/:id", auth, studentController.getById);
router.post("/", auth, authorizeRoles("admin", "teacher"), studentController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), studentController.update);
router.delete("/:id", auth, authorizeRoles("admin"), studentController.delete);

module.exports = router;

// Teacher Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const teacherController = {
  getAll: (req, res) => res.json({ message: "Get all teachers" }),
  getById: (req, res) => res.json({ message: "Get teacher by ID" }),
  create: (req, res) => res.json({ message: "Create teacher" }),
  update: (req, res) => res.json({ message: "Update teacher" }),
  delete: (req, res) => res.json({ message: "Delete teacher" }),
};

router.get("/", auth, teacherController.getAll);
router.get("/:id", auth, teacherController.getById);
router.post("/", auth, authorizeRoles("admin"), teacherController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), teacherController.update);
router.delete("/:id", auth, authorizeRoles("admin"), teacherController.delete);

module.exports = router;

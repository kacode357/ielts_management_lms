// Class Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const classController = {
  getAll: (req, res) => res.json({ message: "Get all classes" }),
  getById: (req, res) => res.json({ message: "Get class by ID" }),
  create: (req, res) => res.json({ message: "Create class" }),
  update: (req, res) => res.json({ message: "Update class" }),
  delete: (req, res) => res.json({ message: "Delete class" }),
  enroll: (req, res) => res.json({ message: "Enroll student in class" }),
};

router.get("/", auth, classController.getAll);
router.get("/:id", auth, classController.getById);
router.post("/", auth, authorizeRoles("admin", "teacher"), classController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), classController.update);
router.delete("/:id", auth, authorizeRoles("admin"), classController.delete);
router.post("/:id/enroll", auth, authorizeRoles("admin", "teacher"), classController.enroll);

module.exports = router;

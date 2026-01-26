// Course Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const courseController = {
  getAll: (req, res) => res.json({ message: "Get all courses" }),
  getById: (req, res) => res.json({ message: "Get course by ID" }),
  create: (req, res) => res.json({ message: "Create course" }),
  update: (req, res) => res.json({ message: "Update course" }),
  delete: (req, res) => res.json({ message: "Delete course" }),
};

router.get("/", courseController.getAll); // Public
router.get("/:id", courseController.getById); // Public
router.post("/", auth, authorizeRoles("admin", "teacher"), courseController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), courseController.update);
router.delete("/:id", auth, authorizeRoles("admin"), courseController.delete);

module.exports = router;

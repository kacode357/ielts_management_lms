// Material Routes
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const authorizeRoles = require("../../middleware/authorizeRoles");

const materialController = {
  getAll: (req, res) => res.json({ message: "Get all materials" }),
  getById: (req, res) => res.json({ message: "Get material by ID" }),
  create: (req, res) => res.json({ message: "Create material" }),
  update: (req, res) => res.json({ message: "Update material" }),
  delete: (req, res) => res.json({ message: "Delete material" }),
  getByCourse: (req, res) => res.json({ message: "Get materials for course" }),
};

router.get("/", auth, materialController.getAll);
router.get("/:id", auth, materialController.getById);
router.post("/", auth, authorizeRoles("admin", "teacher"), materialController.create);
router.put("/:id", auth, authorizeRoles("admin", "teacher"), materialController.update);
router.delete("/:id", auth, authorizeRoles("admin", "teacher"), materialController.delete);
router.get("/course/:courseId", auth, materialController.getByCourse);

module.exports = router;

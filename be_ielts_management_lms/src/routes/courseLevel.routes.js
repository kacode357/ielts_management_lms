// Course Level Routes
const express = require("express");
const router = express.Router();
const courseLevelController = require("../controllers/courseLevel.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// Public routes - anyone can view levels
router.get("/", courseLevelController.getLevels);

// Admin only routes (specific routes before parameterized routes)
router.post("/", auth, authorizeRoles("admin"), courseLevelController.createLevel);
router.post("/reorder", auth, authorizeRoles("admin"), courseLevelController.reorderLevels);

// Parameterized routes
router.get("/:id", courseLevelController.getLevelById);
router.put("/:id", auth, authorizeRoles("admin"), courseLevelController.updateLevel);
router.delete("/:id", auth, authorizeRoles("admin"), courseLevelController.deleteLevel);

module.exports = router;

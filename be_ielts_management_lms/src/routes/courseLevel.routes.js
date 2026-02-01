// Course Level Routes
const express = require("express");
const router = express.Router();
const courseLevelController = require("../controllers/courseLevel.controller");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");

// Public routes - anyone can view levels
router.get("/", courseLevelController.getLevels);
router.get("/dropdown", courseLevelController.getLevelsForDropdown);

// Parameterized routes (MUST be after specific routes)
router.get("/:id", courseLevelController.getLevelById);

// Admin only routes
router.post("/", auth, authorizeRoles("admin"), courseLevelController.createLevel);
router.post("/reorder", auth, authorizeRoles("admin"), courseLevelController.reorderLevels);
router.put("/:id", auth, authorizeRoles("admin"), courseLevelController.updateLevel);
router.delete("/:id", auth, authorizeRoles("admin"), courseLevelController.deleteLevel);

module.exports = router;

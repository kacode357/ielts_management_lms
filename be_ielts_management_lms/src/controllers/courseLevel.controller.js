// Course Level Controller
const courseLevelService = require("../services/courseLevel.service");
const { successResponse, errorResponse } = require("../utils/response");

/**
 * @swagger
 * tags:
 *   name: Course Levels
 *   description: Course level management (Admin only for CUD, public for Read)
 */

/**
 * @swagger
 * /api/course-levels:
 *   get:
 *     summary: Get all course levels
 *     tags: [Course Levels]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Include inactive levels (admin only)
 *     responses:
 *       200:
 *         description: List of course levels
 */
const getLevels = async (req, res) => {
  try {
    const levels = await courseLevelService.getLevels(req.query);
    return successResponse(res, levels, "Course levels retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * @swagger
 * /api/course-levels/{id}:
 *   get:
 *     summary: Get course level by ID
 *     tags: [Course Levels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course level details
 *       404:
 *         description: Course level not found
 */
const getLevelById = async (req, res) => {
  try {
    const level = await courseLevelService.getLevelById(req.params.id);
    return successResponse(res, level, "Course level retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * @swagger
 * /api/course-levels:
 *   post:
 *     summary: Create a new course level (Admin only)
 *     tags: [Course Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: "IELTS 6.5"
 *               code:
 *                 type: string
 *                 example: "IELTS_6_5"
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Course level created
 *       409:
 *         description: Code already exists
 */
const createLevel = async (req, res) => {
  try {
    const level = await courseLevelService.createLevel(req.body);
    return successResponse(res, level, "Course level created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * @swagger
 * /api/course-levels/{id}:
 *   put:
 *     summary: Update course level (Admin only)
 *     tags: [Course Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course level updated
 *       404:
 *         description: Course level not found
 */
const updateLevel = async (req, res) => {
  try {
    const level = await courseLevelService.updateLevel(req.params.id, req.body);
    return successResponse(res, level, "Course level updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * @swagger
 * /api/course-levels/{id}:
 *   delete:
 *     summary: Delete course level - soft delete (Admin only)
 *     tags: [Course Levels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course level deleted
 *       404:
 *         description: Course level not found
 */
const deleteLevel = async (req, res) => {
  try {
    const level = await courseLevelService.deleteLevel(req.params.id);
    return successResponse(res, level, "Course level deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

/**
 * @swagger
 * /api/course-levels/reorder:
 *   post:
 *     summary: Reorder course levels (Admin only)
 *     tags: [Course Levels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               levels:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Levels reordered
 */
const reorderLevels = async (req, res) => {
  try {
    const levels = await courseLevelService.reorderLevels(req.body.levels);
    return successResponse(res, levels, "Course levels reordered successfully");
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

module.exports = {
  getLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel,
  reorderLevels,
};

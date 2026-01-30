// Teacher Controller - Request/Response Handler
const teacherService = require("../services/teacher.service");
const { sendSuccess } = require("../utils/response");
const { getMessages } = require("../responses");

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Get all teachers
 *     description: Get list of all teachers with their IDs for course assignment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of teachers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     teachers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Teacher ID (use this for course.teacherId)
 *                             example: "60d5f9b5e1b3c72d8c8b4567"
 *                           teacherCode:
 *                             type: string
 *                           specialization:
 *                             type: string
 *                           experience:
 *                             type: number
 *                           rating:
 *                             type: number
 *                           userId:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               email:
 *                                 type: string
 */
exports.getTeachers = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await teacherService.getTeachers({}, req.query);

    sendSuccess(res, result, 200, "Teachers retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Get teacher by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     responses:
 *       200:
 *         description: Teacher details
 */
exports.getTeacherById = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const teacher = await teacherService.getTeacherById(req.params.id, lang);

    sendSuccess(res, { teacher }, 200, "Teacher details retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     tags: [Teachers]
 *     summary: Create new teacher (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName, teacherCode]
 *             properties:
 *               email: { type: string, example: "newteacher@ieltslms.com" }
 *               password: { type: string, example: "Teacher@123456" }
 *               firstName: { type: string, example: "Jane" }
 *               lastName: { type: string, example: "Doe" }
 *               phone: { type: string, example: "0901234570" }
 *               teacherCode: { type: string, example: "TCH004" }
 *               specialization: { type: string, example: "IELTS Writing" }
 *               experience: { type: number, example: 3 }
 *               certifications: { type: array, items: { type: string }, example: ["TESOL", "CELTA"] }
 *               bio: { type: string, example: "Experienced IELTS instructor" }
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       403:
 *         description: Admin only
 */
exports.createTeacher = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const teacher = await teacherService.createTeacher(req.body, lang);

    sendSuccess(res, { teacher }, 201, "Teacher created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     tags: [Teachers]
 *     summary: Update teacher (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               email: { type: string }
 *               isActive: { type: boolean }
 *               specialization: { type: string }
 *               experience: { type: number }
 *               certifications: { type: array, items: { type: string } }
 *               bio: { type: string }
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       403:
 *         description: Admin only
 */
exports.updateTeacher = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const teacher = await teacherService.updateTeacher(req.params.id, req.body, lang);

    sendSuccess(res, { teacher }, 200, "Teacher updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     tags: [Teachers]
 *     summary: Delete/Deactivate teacher (Admin only)
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
 *         description: Teacher deactivated successfully
 *       403:
 *         description: Admin only
 */
exports.deleteTeacher = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await teacherService.deleteTeacher(req.params.id, lang);

    sendSuccess(res, result, 200, "Teacher deactivated successfully");
  } catch (error) {
    next(error);
  }
};

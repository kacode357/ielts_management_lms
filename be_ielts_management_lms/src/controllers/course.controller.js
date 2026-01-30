// Course Controller - Request/Response Handler
const courseService = require("../services/course.service");
const { sendSuccess } = require("../utils/response");
const { getMessages } = require("../responses");

/**
 * @swagger
 * /api/courses:
 *   post:
 *     tags: [Courses]
 *     summary: Create new course
 *     description: |
 *       Create a new course. Use GET /api/teachers to get valid teacher IDs.
 *       **IMPORTANT:** teacherId must be a Teacher._id (NOT User._id)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, level, startDate, endDate]
 *             properties:
 *               name: { type: string, example: "IELTS 6.0 Foundation" }
 *               code: { type: string, example: "IELTS-F-2024-01" }
 *               description: { type: string, example: "Foundation course for IELTS beginners" }
 *               level: { type: string, example: "Foundation" }
 *               teacherId: { type: string, example: "60d5f9b5e1b3c72d8c8b4567", description: "Teacher ObjectId (get from GET /api/teachers)" }
 *               startDate: { type: string, format: date, example: "2024-02-01" }
 *               endDate: { type: string, format: date, example: "2024-05-31" }
 *               totalHours: { type: number, example: 72 }
 *               room: { type: string, example: "Room A1" }
 *               scheduleDesc: { type: string, example: "Mon-Wed-Fri 19:00-21:00" }
 *               maxStudents: { type: number, example: 30 }
 *     responses:
 *       201:
 *         description: Course created successfully
 */
exports.createCourse = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const course = await courseService.createCourse(req.body, lang);
    
    sendSuccess(res, { course }, 201, messages.COURSE.CREATED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get course by ID
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
 *         description: Course details
 */
exports.getCourseById = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const course = await courseService.getCourseById(req.params.id, req.user, lang);
    
    sendSuccess(res, { course }, 200, messages.COURSE.DETAIL_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses with filters
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
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, ongoing, completed, cancelled]
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of courses
 */
exports.getCourses = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await courseService.getCourses(req.user, req.query);
    
    sendSuccess(res, result, 200, messages.COURSE.LIST_SUCCESS);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     tags: [Courses]
 *     summary: Update course
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
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const course = await courseService.updateCourse(req.params.id, req.body, lang);
    
    sendSuccess(res, { course }, 200, messages.COURSE.UPDATED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     tags: [Courses]
 *     summary: Delete course (soft delete)
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
 *         description: Course deleted successfully
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const course = await courseService.deleteCourse(req.params.id, lang);
    
    sendSuccess(res, { course }, 200, messages.COURSE.DELETED);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}/members:
 *   get:
 *     tags: [Courses]
 *     summary: Get course members (teacher and enrolled students)
 *     description: |
 *       Get teacher and list of students enrolled in a course (only active users)
 *       **Authorization:**
 *       - Admin: Can view all course members
 *       - Teacher: Can view members of courses they teach
 *       - Student: Can view members of courses they are enrolled in
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *     responses:
 *       200:
 *         description: List of course members
 *       403:
 *         description: Access denied
 */
exports.getCourseMembers = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await courseService.getCourseMembers(req.params.id, req.user, req.query);
    
    sendSuccess(res, result, 200, "Course members retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}/enroll:
 *   post:
 *     tags: [Courses]
 *     summary: Add students to course (Admin only)
 *     description: Enroll multiple students in a course by creating enrollment records
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentIds
 *             properties:
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Student IDs to enroll
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       201:
 *         description: Students enrolled successfully
 *       400:
 *         description: Invalid request or course is full
 *       404:
 *         description: Course or student not found
 */
exports.enrollStudent = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const result = await courseService.enrollStudents(req.params.id, req.body.studentIds);
    
    sendSuccess(res, result, 201, "Students enrollment completed");
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/courses/{id}/teacher:
 *   put:
 *     tags: [Courses]
 *     summary: Assign/change teacher for course (Admin only)
 *     description: Assign or change the teacher for a course
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *             properties:
 *               teacherId:
 *                 type: string
 *                 description: Teacher ID to assign
 *     responses:
 *       200:
 *         description: Teacher assigned successfully
 *       404:
 *         description: Course or teacher not found
 */
exports.assignTeacher = async (req, res, next) => {
  try {
    const lang = req.headers["accept-language"] || "en";
    const messages = getMessages(lang);
    const course = await courseService.assignTeacher(req.params.id, req.body.teacherId);
    
    sendSuccess(res, { course }, 200, "Teacher assigned successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
